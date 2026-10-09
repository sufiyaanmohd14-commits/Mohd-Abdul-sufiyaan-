import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, TrayPiece, ActiveDrag } from './types/game';
import {
  createEmptyGrid,
  canPlaceShape,
  placeShape,
  findFullLines,
  calculateClearScore,
  isGameOver,
  GRID_SIZE,
} from './utils/gameLogic';
import { generateTrayShapes } from './utils/shapes';
import { audio } from './utils/audio';
import { GridBoard } from './components/GridBoard';
import { GameTheme, THEMES, getMorphThemeSequence, getNextBlastTheme } from './utils/themeConfig';
import { PieceTray } from './components/PieceTray';
import { DraggedPieceOverlay } from './components/DraggedPieceOverlay';
import { ParticleCanvas, ParticleCanvasHandle } from './components/ParticleCanvas';
import { ParallaxBackground, BlastEvent } from './components/ParallaxBackground';
import { ScoreHeader } from './components/ScoreHeader';
import { AllBlastBar } from './components/AllBlastBar';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DailyChallengeHeader } from './components/DailyChallengeHeader';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DailyVictoryModal } from './components/DailyVictoryModal';
import { GameMode, DailyPuzzleConfig } from './types/game';
import {
  getTodayDateKey,
  getDailyPuzzleConfig,
  countRemainingPresetBlocks,
  calculateStarRating,
} from './utils/dailyPuzzle';
import { getDailyStreak, isDailyCompleted } from './utils/leaderboardStorage';

const HIGH_SCORE_KEY = 'blockblast_high_score';

export default function App() {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [trayPieces, setTrayPieces] = useState<TrayPiece[]>(() => {
    return generateTrayShapes().map((shape) => ({
      instanceId: Math.random().toString(36).substring(2, 9),
      shape,
      used: false,
    }));
  });

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getMuted());
  const [theme, setTheme] = useState<GameTheme>('midnight');

  // Game Mode & Daily Challenge States
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [dailyConfig, setDailyConfig] = useState<DailyPuzzleConfig>(() =>
    getDailyPuzzleConfig(getTodayDateKey())
  );
  const [dailyMovesRemaining, setDailyMovesRemaining] = useState<number>(
    () => getDailyPuzzleConfig(getTodayDateKey()).maxMoves
  );
  const [dailyBatchIndex, setDailyBatchIndex] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(() => getDailyStreak());
  const [isDailyCompletedToday, setIsDailyCompletedToday] = useState<boolean>(() =>
    isDailyCompleted(getDailyPuzzleConfig(getTodayDateKey()).dateKey)
  );
  const [isDailyVictoryModalOpen, setIsDailyVictoryModalOpen] = useState<boolean>(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState<boolean>(false);
  const [dailyStartTime, setDailyStartTime] = useState<number>(() => Date.now());
  const [dailyCompletionTime, setDailyCompletionTime] = useState<number>(0);
  const [dailyWon, setDailyWon] = useState<boolean>(false);
  const [dailyStars, setDailyStars] = useState<number>(0);

  // Skin Morph Settings & States
  const [morphTimes, setMorphTimes] = useState<number>(5);
  const [autoMorphOnClears, setAutoMorphOnClears] = useState<boolean>(false);
  const [autoBgColorOnBlast, setAutoBgColorOnBlast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_auto_bg_blast');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [parallaxEnabled, setParallaxEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_parallax_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [blastEvent, setBlastEvent] = useState<BlastEvent | null>(null);
  const [bgShiftToast, setBgShiftToast] = useState<{
    name: string;
    icon: string;
    color: string;
  } | null>(null);
  const [isSkinMorphing, setIsSkinMorphing] = useState<boolean>(false);
  const [morphStep, setMorphStep] = useState<number>(0);
  const [totalMorphSteps, setTotalMorphSteps] = useState<number>(5);

  // All-Block Blast Power States
  const [blastCharge, setBlastCharge] = useState<number>(65); // starts at 65% for quick accessibility
  const [isSuperBlasting, setIsSuperBlasting] = useState<boolean>(false);
  const [isBoardShaking, setIsBoardShaking] = useState<boolean>(false);

  // Selected piece for click/tap accessibility mode
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);

  // Active dragging state
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [cellSize, setCellSize] = useState<number>(42);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<ParticleCanvasHandle | null>(null);

  // Execute Multi-Skin Morph Sequence across multiple times
  const executeMultiSkinMorph = useCallback(
    (targetStepsCount: number = morphTimes) => {
      setIsSkinMorphing(true);
      setTotalMorphSteps(targetStepsCount);
      setMorphStep(1);

      // Get sequence of distinct contrasting themes
      const sequence = getMorphThemeSequence(theme, targetStepsCount);

      sequence.forEach((nextTheme, index) => {
        const stepNumber = index + 1;
        const delay = index * 320; // 320ms per skin change

        setTimeout(() => {
          setTheme(nextTheme);
          setMorphStep(stepNumber);
          audio.playSkinMorph(stepNumber, targetStepsCount);

          // Particle theme shower in new theme's colors
          const themeMeta = THEMES[nextTheme];
          if (themeMeta) {
            particleCanvasRef.current?.themeShower(themeMeta.particleColors);
          }

          // Floating text announcement on canvas
          if (boardRef.current && particleCanvasRef.current) {
            const rect = boardRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height * 0.35 + (index % 2 === 0 ? -15 : 15);
            const text =
              stepNumber === targetStepsCount
                ? `✨ ${themeMeta.name.toUpperCase()} UNLOCKED! ${themeMeta.icon}`
                : `⚡ MORPH ${stepNumber}/${targetStepsCount}: ${themeMeta.name.toUpperCase()}! ${themeMeta.icon}`;
            particleCanvasRef.current.floatingText(cx, cy, text, themeMeta.accentColor);
          }

          // If this was the final step
          if (stepNumber === targetStepsCount) {
            setTimeout(() => {
              setIsSkinMorphing(false);
              audio.playAllClearFanfare();
              particleCanvasRef.current?.celebrate();
            }, 350);
          }
        }, delay);
      });
    },
    [theme, morphTimes]
  );

  // Measure board cell size on mount/resize
  useEffect(() => {
    const updateCellSize = () => {
      if (boardRef.current) {
        const boardWidth = boardRef.current.clientWidth;
        // Board has padding (~24px total) and 7 gaps (~10px total)
        const innerWidth = boardWidth - 32;
        setCellSize(Math.max(28, Math.floor(innerWidth / GRID_SIZE)));
      }
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  // Update high score persistence
  const updateScore = useCallback(
    (pointsToAdd: number) => {
      setScore((prevScore) => {
        const newScore = prevScore + pointsToAdd;
        if (newScore > highScore) {
          if (prevScore <= highScore && highScore > 0) {
            audio.playNewHighScore();
            if (boardRef.current && particleCanvasRef.current) {
              const rect = boardRef.current.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height * 0.35;
              particleCanvasRef.current.floatingText(cx, cy, '👑 NEW BEST SCORE! 👑', '#FACC15');
            }
          }
          setHighScore(newScore);
          setIsNewHighScore(true);
          localStorage.setItem(HIGH_SCORE_KEY, String(newScore));
        }
        return newScore;
      });
    },
    [highScore]
  );

  // Calculate target grid coordinate (top-left of shape) from screen pointer
  const getGridCoordFromPoint = useCallback(
    (clientX: number, clientY: number, active: ActiveDrag) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();

      const effectiveY = clientY - active.offsetY;

      // Check if pointer is in or near board
      if (
        clientX < rect.left - 20 ||
        clientX > rect.right + 20 ||
        effectiveY < rect.top - 20 ||
        effectiveY > rect.bottom + 20
      ) {
        return null;
      }

      const boardW = rect.width;
      const boardH = rect.height;
      const cellW = boardW / GRID_SIZE;
      const cellH = boardH / GRID_SIZE;

      const hoveredCol = Math.floor((clientX - rect.left) / cellW);
      const hoveredRow = Math.floor((effectiveY - rect.top) / cellH);

      const shapeRows = active.piece.shape.matrix.length;
      const shapeCols = active.piece.shape.matrix[0].length;

      // Center piece on pointer
      const startRow = hoveredRow - Math.floor(shapeRows / 2);
      const startCol = hoveredCol - Math.floor(shapeCols / 2);

      return { row: startRow, col: startCol };
    },
    []
  );

  // Trigger All-Block Blast Power detonation & Multi-Skin Morph
  const triggerAllBlockBlast = useCallback(() => {
    if (isSuperBlasting || isSkinMorphing) return;

    audio.playChargeUp();

    // Collect all cells to blast
    let filledCount = 0;
    const blastPoints: { x: number; y: number; color: string }[] = [];
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (boardRect) {
      const cellW = boardRect.width / GRID_SIZE;
      const cellH = boardRect.height / GRID_SIZE;

      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.filled) {
            filledCount++;
            blastPoints.push({
              x: boardRect.left + c * cellW + cellW / 2,
              y: boardRect.top + r * cellH + cellH / 2,
              color: cell.color || '#FBBF24',
            });
          }
        });
      });
    }

    // If board is empty, create a full-grid rainbow fireworks pattern
    if (filledCount === 0 && boardRect) {
      const cellW = boardRect.width / GRID_SIZE;
      const cellH = boardRect.height / GRID_SIZE;
      const sampleColors = ['#F59E0B', '#EF4444', '#38BDF8', '#10B981', '#A855F7', '#EC4899'];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if ((r + c) % 2 === 0) {
            blastPoints.push({
              x: boardRect.left + c * cellW + cellW / 2,
              y: boardRect.top + r * cellH + cellH / 2,
              color: sampleColors[(r + c) % sampleColors.length],
            });
          }
        }
      }
    }

    setIsSuperBlasting(true);
    setIsBoardShaking(true);

    // Explosion audio
    setTimeout(() => {
      audio.playExplosion();
    }, 80);

    // Send blast event to background parallax & shockwave
    const blastCx = boardRect ? boardRect.left + boardRect.width / 2 : undefined;
    const blastCy = boardRect ? boardRect.top + boardRect.height / 2 : undefined;
    setBlastEvent({
      id: Date.now(),
      color: '#F59E0B',
      x: blastCx,
      y: blastCy,
      count: 64,
    });

    // Mega Particle Blast on Canvas
    if (blastPoints.length > 0) {
      particleCanvasRef.current?.megaBlast(blastPoints);
    }

    // Floating text announcements
    if (boardRect && particleCanvasRef.current) {
      const cx = boardRect.left + boardRect.width / 2;
      const cy = boardRect.top + boardRect.height * 0.42;
      particleCanvasRef.current.floatingText(cx, cy, '💥 ALL-BLOCK BLAST! 💥', '#FDE047');
      particleCanvasRef.current.floatingText(cx, cy + 32, '+2,500 SUPER CLEAR!', '#38BDF8');
    }

    // Score points and reset blast charge
    updateScore(2500);
    setBlastCharge(0);

    // Mark all cells with superBlasting animation
    const detonatingGrid = grid.map((row) =>
      row.map((cell) => (cell.filled ? { ...cell, superBlasting: true, clearing: true } : cell))
    );
    setGrid(detonatingGrid);

    // Clear board after explosion wave
    setTimeout(() => {
      setGrid(createEmptyGrid());
      setIsSuperBlasting(false);
      setIsBoardShaking(false);

      // Trigger the Multi-Skin Morph sequence!
      executeMultiSkinMorph(morphTimes);
    }, 280);
  }, [
    grid,
    isSuperBlasting,
    isSkinMorphing,
    morphTimes,
    updateScore,
    executeMultiSkinMorph,
  ]);

  // Reset & Start Daily Game with pre-generated configuration
  const startDailyGame = useCallback((config: DailyPuzzleConfig = dailyConfig) => {
    // Clone initial grid with fresh cell objects
    const freshGrid = config.initialGrid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    setGrid(freshGrid);

    const initialShapes = config.predefinedShapeBatches[0] || generateTrayShapes();
    setTrayPieces(
      initialShapes.map((shape) => ({
        instanceId: Math.random().toString(36).substring(2, 9),
        shape,
        used: false,
      }))
    );
    setScore(0);
    setComboStreak(0);
    setMaxCombo(0);
    setLinesClearedTotal(0);
    setIsNewHighScore(false);
    setSelectedPieceIndex(null);
    setDailyMovesRemaining(config.maxMoves);
    setDailyBatchIndex(0);
    setDailyStartTime(Date.now());
    setIsDailyVictoryModalOpen(false);
    audio.playPickup();
  }, [dailyConfig]);

  // Core move execution logic
  const handlePiecePlacement = useCallback(
    (pieceIndex: number, targetRow: number, targetCol: number) => {
      const piece = trayPieces[pieceIndex];
      if (!piece || piece.used) return;

      if (!canPlaceShape(grid, piece.shape.matrix, targetRow, targetCol)) {
        audio.playCancel();
        return;
      }

      // 1. Place piece on grid
      const newGrid = placeShape(grid, piece.shape.matrix, targetRow, targetCol, piece.shape);
      audio.playPlace();

      // Count placed cells for placement score
      let placedBlockCount = 0;
      piece.shape.matrix.forEach((row) =>
        row.forEach((v) => {
          if (v === 1) placedBlockCount++;
        })
      );
      updateScore(placedBlockCount);

      // Charge blast meter on placement
      setBlastCharge((prev) => Math.min(100, prev + 12));

      // Mark piece used in tray
      const updatedTray = trayPieces.map((p, idx) =>
        idx === pieceIndex ? { ...p, used: true } : p
      );
      setSelectedPieceIndex(null);

      // Track daily moves if in daily mode
      let nextDailyMoves = dailyMovesRemaining;
      if (gameMode === 'daily') {
        nextDailyMoves = Math.max(0, dailyMovesRemaining - 1);
        setDailyMovesRemaining(nextDailyMoves);
      }

      // 2. Check for completed lines
      const { rows: fullRows, cols: fullCols } = findFullLines(newGrid);
      const totalFullLines = fullRows.length + fullCols.length;

      // Evaluation helper for daily challenge objective
      const checkDailyGoals = (currentBoard: Grid, movesLeft: number) => {
        if (gameMode !== 'daily') return;

        const remainingPresets = countRemainingPresetBlocks(currentBoard);
        const isSolved = remainingPresets === 0;

        if (isSolved) {
          const elapsed = Math.max(5, Math.floor((Date.now() - dailyStartTime) / 1000));
          const movesUsed = dailyConfig.maxMoves - movesLeft;
          const stars = calculateStarRating(
            dailyConfig.presetBlocksTotal,
            dailyConfig.presetBlocksTotal,
            movesUsed,
            dailyConfig.maxMoves
          );
          setDailyWon(true);
          setDailyStars(stars);
          setDailyCompletionTime(elapsed);
          setIsDailyCompletedToday(true);

          // Bonus points for remaining moves & time
          const bonusPoints = 1500 + movesLeft * 200;
          updateScore(bonusPoints);

          audio.playAllClearFanfare();
          particleCanvasRef.current?.celebrate();

          setTimeout(() => {
            setIsDailyVictoryModalOpen(true);
          }, 650);
        } else if (movesLeft <= 0) {
          // Ran out of moves
          const elapsed = Math.max(5, Math.floor((Date.now() - dailyStartTime) / 1000));
          const clearedCount = dailyConfig.presetBlocksTotal - remainingPresets;
          const stars = calculateStarRating(
            clearedCount,
            dailyConfig.presetBlocksTotal,
            dailyConfig.maxMoves,
            dailyConfig.maxMoves
          );
          setDailyWon(false);
          setDailyStars(stars);
          setDailyCompletionTime(elapsed);

          audio.playGameOver();
          setTimeout(() => {
            setIsDailyVictoryModalOpen(true);
          }, 650);
        }
      };

      if (totalFullLines > 0) {
        const nextStreak = comboStreak + 1;
        setComboStreak(nextStreak);
        setMaxCombo((prev) => Math.max(prev, nextStreak));
        setLinesClearedTotal((prev) => prev + totalFullLines);

        // Boost blast charge on clears
        setBlastCharge((prev) => Math.min(100, prev + totalFullLines * 25));

        const clearPoints = calculateClearScore(totalFullLines, nextStreak);
        updateScore(clearPoints);

        // Find primary color of cleared blocks for dynamic background flash
        let blastPrimaryColor = '#38BDF8';
        for (const r of fullRows) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[r][c]?.color) {
              blastPrimaryColor = newGrid[r][c].color!;
              break;
            }
          }
        }
        if (fullCols.length > 0) {
          const fc = fullCols[0];
          for (let r = 0; r < GRID_SIZE; r++) {
            if (newGrid[r][fc]?.color) {
              blastPrimaryColor = newGrid[r][fc].color!;
              break;
            }
          }
        }

        const boardRect = boardRef.current?.getBoundingClientRect();
        const blastCx = boardRect ? boardRect.left + boardRect.width / 2 : undefined;
        const blastCy = boardRect ? boardRect.top + boardRect.height / 2 : undefined;

        // Send shockwave ripple and flash to parallax background
        setBlastEvent({
          id: Date.now(),
          color: blastPrimaryColor,
          x: blastCx,
          y: blastCy,
          count: totalFullLines,
        });

        // Automatically change background color / skin theme when blocks blast!
        if (autoBgColorOnBlast && !isSkinMorphing) {
          const nextTheme = getNextBlastTheme(theme);
          setTheme(nextTheme);
          const meta = THEMES[nextTheme];
          if (meta) {
            setBgShiftToast({
              name: meta.name,
              icon: meta.icon,
              color: meta.accentColor,
            });
            setTimeout(() => {
              setBgShiftToast((cur) => (cur?.name === meta.name ? null : cur));
            }, 1800);
          }
        }

        if (nextStreak >= 2) {
          audio.playComboFanfare(nextStreak);
        } else {
          audio.playLineClear(nextStreak, totalFullLines);
        }

        // Trigger particle bursts and mark cells for clearing animation
        const animGrid = newGrid.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const isFullRow = fullRows.includes(r);
            const isFullCol = fullCols.includes(c);
            if (isFullRow || isFullCol) {
              // Trigger particle burst at this cell's screen position
              if (boardRect && particleCanvasRef.current) {
                const cellW = boardRect.width / GRID_SIZE;
                const cellH = boardRect.height / GRID_SIZE;
                const px = boardRect.left + c * cellW + cellW / 2;
                const py = boardRect.top + r * cellH + cellH / 2;
                particleCanvasRef.current.burstAt(px, py, cell.color || '#38BDF8', 10);
              }
              return { ...cell, clearing: true };
            }
            return cell;
          })
        );

        setGrid(animGrid);

        // Floating score popup in the center of the board
        if (boardRect && particleCanvasRef.current) {
          const centerX = boardRect.left + boardRect.width / 2;
          const centerY = boardRect.top + boardRect.height * 0.45;
          const bonusText =
            nextStreak > 1
              ? `+${clearPoints} (${nextStreak}x COMBO!)`
              : `+${clearPoints}`;
          particleCanvasRef.current.floatingText(centerX, centerY, bonusText, '#FBBF24');
        }

        // After clearing animation settles (180ms), remove cleared cells from grid
        setTimeout(() => {
          const clearedGrid = animGrid.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              if (fullRows.includes(r) || fullCols.includes(c)) {
                return { filled: false };
              }
              return cell;
            })
          );
          setGrid(clearedGrid);

          // Check for Natural ALL CLEAR (every single block on grid was blasted away)
          const isAllClear = clearedGrid.every((row) => row.every((c) => !c.filled));
          if (isAllClear) {
            audio.playExplosion();
            audio.playAllClearFanfare();
            updateScore(2000);
            setBlastEvent({
              id: Date.now(),
              color: '#FDE047',
              x: blastCx,
              y: blastCy,
              count: 64,
            });
            if (boardRect && particleCanvasRef.current) {
              const cx = boardRect.left + boardRect.width / 2;
              const cy = boardRect.top + boardRect.height * 0.42;
              particleCanvasRef.current.floatingText(cx, cy, '🌟 BOARD CLEAR! ALL BLOCKS BLASTED! 🌟', '#FDE047');
              particleCanvasRef.current.floatingText(cx, cy + 32, '+2,000 PTS & SKIN MORPH!', '#38BDF8');
            }
            // All block blast triggered natural skin morph!
            executeMultiSkinMorph(morphTimes);
          } else if (autoMorphOnClears && nextStreak >= 2) {
            executeMultiSkinMorph(3);
          }

          // Check daily challenge goals
          checkDailyGoals(clearedGrid, nextDailyMoves);

          // Check if tray needs refill
          handleTrayAndGameOverCheck(clearedGrid, updatedTray);
        }, 180);
      } else {
        // No lines cleared: reset combo streak
        setComboStreak(0);
        setGrid(newGrid);
        checkDailyGoals(newGrid, nextDailyMoves);
        handleTrayAndGameOverCheck(newGrid, updatedTray);
      }
    },
    [
      grid,
      trayPieces,
      comboStreak,
      updateScore,
      morphTimes,
      autoMorphOnClears,
      executeMultiSkinMorph,
      gameMode,
      dailyMovesRemaining,
      dailyConfig,
      dailyStartTime,
      theme,
      autoBgColorOnBlast,
      isSkinMorphing,
    ]
  );

  // Check if tray should refill and whether game over condition is met
  const handleTrayAndGameOverCheck = useCallback(
    (currentGrid: Grid, currentTray: TrayPiece[]) => {
      const allUsed = currentTray.every((p) => p.used);
      let finalTray = currentTray;

      if (allUsed) {
        if (gameMode === 'daily') {
          // Load next deterministic batch for the daily challenge
          const nextBatch = (dailyBatchIndex + 1) % dailyConfig.predefinedShapeBatches.length;
          setDailyBatchIndex(nextBatch);
          const nextShapes = dailyConfig.predefinedShapeBatches[nextBatch] || generateTrayShapes();
          finalTray = nextShapes.map((shape) => ({
            instanceId: Math.random().toString(36).substring(2, 9),
            shape,
            used: false,
          }));
        } else {
          // Random shapes for classic mode
          finalTray = generateTrayShapes().map((shape) => ({
            instanceId: Math.random().toString(36).substring(2, 9),
            shape,
            used: false,
          }));
        }
        setTrayPieces(finalTray);
        particleCanvasRef.current?.celebrate();
      } else {
        setTrayPieces(finalTray);
      }

      // Check if game is over (no remaining piece can fit anywhere)
      if (isGameOver(currentGrid, finalTray)) {
        setTimeout(() => {
          if (gameMode === 'daily') {
            const remaining = countRemainingPresetBlocks(currentGrid);
            const cleared = dailyConfig.presetBlocksTotal - remaining;
            const stars = calculateStarRating(
              cleared,
              dailyConfig.presetBlocksTotal,
              dailyConfig.maxMoves,
              dailyConfig.maxMoves
            );
            setDailyWon(cleared === dailyConfig.presetBlocksTotal);
            setDailyStars(stars);
            setDailyCompletionTime(Math.max(5, Math.floor((Date.now() - dailyStartTime) / 1000)));
            audio.playGameOver();
            setIsDailyVictoryModalOpen(true);
          } else {
            audio.playGameOver();
            setIsGameOverModalOpen(true);
          }
        }, 350);
      }
    },
    [gameMode, dailyBatchIndex, dailyConfig, dailyStartTime]
  );

  // Drag start handlers (Touch & Mouse)
  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    piece: TrayPiece,
    index: number
  ) => {
    if (piece.used) return;

    let clientX = 0;
    let clientY = 0;
    const isTouch = 'touches' in e;

    if (isTouch) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Offset on touch so player's finger doesn't obscure the piece preview (~65px)
    const offsetY = isTouch ? 65 : 0;

    audio.playPickup();
    setSelectedPieceIndex(index);

    const initialDrag: ActiveDrag = {
      piece,
      pieceIndex: index,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      offsetY,
      hoverGridCoord: null,
      isValidPlacement: false,
    };

    const coord = getGridCoordFromPoint(clientX, clientY, initialDrag);
    if (coord) {
      initialDrag.hoverGridCoord = coord;
      initialDrag.isValidPlacement = canPlaceShape(grid, piece.shape.matrix, coord.row, coord.col);
    }

    setActiveDrag(initialDrag);
  };

  // Window drag move and release handlers
  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const coord = getGridCoordFromPoint(clientX, clientY, activeDrag);
      let isValid = false;

      if (coord) {
        isValid = canPlaceShape(
          grid,
          activeDrag.piece.shape.matrix,
          coord.row,
          coord.col
        );
      }

      setActiveDrag((prev) =>
        prev
          ? {
              ...prev,
              currentX: clientX,
              currentY: clientY,
              hoverGridCoord: coord,
              isValidPlacement: isValid,
            }
          : null
      );
    };

    const handlePointerUp = () => {
      if (activeDrag && activeDrag.hoverGridCoord && activeDrag.isValidPlacement) {
        handlePiecePlacement(
          activeDrag.pieceIndex,
          activeDrag.hoverGridCoord.row,
          activeDrag.hoverGridCoord.col
        );
      } else if (activeDrag) {
        audio.playCancel();
      }
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [activeDrag, grid, getGridCoordFromPoint, handlePiecePlacement]);

  // Click board cell in tap-to-place mode
  const handleCellClick = (r: number, c: number) => {
    if (selectedPieceIndex === null) return;
    const piece = trayPieces[selectedPieceIndex];
    if (!piece || piece.used) return;

    const shapeRows = piece.shape.matrix.length;
    const shapeCols = piece.shape.matrix[0].length;

    // Center piece on clicked cell
    const startRow = r - Math.floor(shapeRows / 2);
    const startCol = c - Math.floor(shapeCols / 2);

    if (canPlaceShape(grid, piece.shape.matrix, startRow, startCol)) {
      handlePiecePlacement(selectedPieceIndex, startRow, startCol);
    } else {
      audio.playCancel();
    }
  };

  // Reset / New Game
  const startNewGame = useCallback(() => {
    if (gameMode === 'daily') {
      startDailyGame(dailyConfig);
      return;
    }
    setGrid(createEmptyGrid());
    setTrayPieces(
      generateTrayShapes().map((shape) => ({
        instanceId: Math.random().toString(36).substring(2, 9),
        shape,
        used: false,
      }))
    );
    setScore(0);
    setComboStreak(0);
    setMaxCombo(0);
    setLinesClearedTotal(0);
    setIsNewHighScore(false);
    setSelectedPieceIndex(null);
    setIsGameOverModalOpen(false);
    audio.playPickup();
  }, [gameMode, dailyConfig, startDailyGame]);

  // Switch between Classic Endless and Daily Challenge mode
  const handleSwitchMode = useCallback(
    (newMode: GameMode) => {
      if (newMode === gameMode) return;
      setGameMode(newMode);
      if (newMode === 'daily') {
        startDailyGame(dailyConfig);
      } else {
        setGrid(createEmptyGrid());
        setTrayPieces(
          generateTrayShapes().map((shape) => ({
            instanceId: Math.random().toString(36).substring(2, 9),
            shape,
            used: false,
          }))
        );
        setScore(0);
        setComboStreak(0);
        setSelectedPieceIndex(null);
        audio.playPickup();
      }
    },
    [gameMode, dailyConfig, startDailyGame]
  );

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  // Cycle Theme sequentially
  const handleCycleTheme = () => {
    const allThemeKeys: GameTheme[] = [
      'midnight',
      'cyber',
      'cosmic',
      'lava',
      'ice',
      'gold',
      'emerald',
      'woodcraft',
      'candy',
      'retro',
    ];
    setTheme((current) => {
      const idx = allThemeKeys.indexOf(current);
      return allThemeKeys[(idx + 1) % allThemeKeys.length];
    });
  };

  // Theme container classes
  const getAppBgClass = () => {
    return THEMES[theme]?.appBgClass || 'bg-[#0b0e14] text-slate-100';
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between select-none font-['Plus_Jakarta_Sans'] transition-colors duration-700 relative overflow-hidden ${getAppBgClass()}`}
    >
      {/* Interactive Parallax Background with Dynamic Depth & Shockwave Blast */}
      <ParallaxBackground
        theme={theme}
        enabled={parallaxEnabled}
        blastEvent={blastEvent}
      />

      {/* Particle Canvas Overlay for Line Blasts */}
      <ParticleCanvas ref={particleCanvasRef} />

      {/* Floating Drag Overlay */}
      <DraggedPieceOverlay activeDrag={activeDrag} cellSize={cellSize} />

      {/* Top Header */}
      <ScoreHeader
        score={score}
        highScore={highScore}
        comboStreak={comboStreak}
        isMuted={isMuted}
        theme={theme}
        onToggleMute={handleToggleMute}
        onNewGame={startNewGame}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSkinModal={() => setIsSkinModalOpen(true)}
        onCycleTheme={handleCycleTheme}
      />

      {/* Floating Dynamic Background Shift Toast */}
      {bgShiftToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-3">
          <span className="text-base">{bgShiftToast.icon}</span>
          <span className="text-xs font-extrabold text-white font-['Outfit'] tracking-wide">
            Auto BG Shift:{' '}
            <span style={{ color: bgShiftToast.color }}>{bgShiftToast.name}</span>
          </span>
        </div>
      )}

      {/* Main Game Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-lg mx-auto w-full">
        {/* Game Mode Selector & Daily Challenge Info */}
        <DailyChallengeHeader
          mode={gameMode}
          dailyConfig={dailyConfig}
          streak={dailyStreak}
          movesRemaining={dailyMovesRemaining}
          presetsRemaining={countRemainingPresetBlocks(grid)}
          isCompleted={isDailyCompletedToday}
          onSwitchMode={handleSwitchMode}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          onResetDaily={() => startDailyGame(dailyConfig)}
        />

        {/* All-Block Blast Power Bar & Morph Status */}
        <AllBlastBar
          charge={blastCharge}
          isBlasting={isSuperBlasting}
          isMorphing={isSkinMorphing}
          morphStep={morphStep}
          totalMorphSteps={totalMorphSteps}
          currentTheme={theme}
          onTriggerAllBlast={triggerAllBlockBlast}
          onOpenSkinModal={() => setIsSkinModalOpen(true)}
        />

        {/* Combo Banner Alert */}
        {comboStreak > 1 && (
          <div className="my-1 text-center animate-bounce">
            <span className="text-xs sm:text-sm font-black text-amber-400 font-['Outfit'] tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
              🔥 {comboStreak}x Streak Combo!
            </span>
          </div>
        )}

        {/* 8x8 Board */}
        <GridBoard
          grid={grid}
          theme={theme}
          activeDrag={activeDrag}
          boardRef={boardRef}
          selectedPieceIndex={selectedPieceIndex}
          isShaking={isBoardShaking}
          isMorphing={isSkinMorphing}
          onCellClick={handleCellClick}
        />

        {/* Shape Tray */}
        <PieceTray
          pieces={trayPieces}
          grid={grid}
          selectedPieceIndex={selectedPieceIndex}
          onSelectPiece={(idx) => setSelectedPieceIndex(idx)}
          onDragStart={handleDragStart}
        />

        {/* Quick Accessibility Tip */}
        <p className="text-[11px] text-slate-500 text-center mt-1">
          {gameMode === 'daily'
            ? 'Clear all pre-set obstacle blocks before your moves run out to place on the leaderboard!'
            : 'Drag & drop pieces or tap to select and place on the grid'}
        </p>
      </main>

      {/* Modals */}
      <SkinSelectorModal
        isOpen={isSkinModalOpen}
        currentTheme={theme}
        morphTimes={morphTimes}
        autoMorphOnClears={autoMorphOnClears}
        autoBgColorOnBlast={autoBgColorOnBlast}
        parallaxEnabled={parallaxEnabled}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
        onChangeMorphTimes={(times) => setMorphTimes(times)}
        onToggleAutoMorphOnClears={() => setAutoMorphOnClears((prev) => !prev)}
        onToggleAutoBgColorOnBlast={() =>
          setAutoBgColorOnBlast((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
              localStorage.setItem('blockblast_auto_bg_blast', String(next));
            }
            return next;
          })
        }
        onToggleParallax={() =>
          setParallaxEnabled((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
              localStorage.setItem('blockblast_parallax_enabled', String(next));
            }
            return next;
          })
        }
        onTriggerMorphPreview={triggerAllBlockBlast}
        onClose={() => setIsSkinModalOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        dateKey={dailyConfig.dateKey}
        userScore={score}
      />

      <DailyVictoryModal
        isOpen={isDailyVictoryModalOpen}
        isWon={dailyWon}
        score={score}
        movesUsed={dailyConfig.maxMoves - dailyMovesRemaining}
        stars={dailyStars}
        timeSeconds={dailyCompletionTime}
        presetsCleared={dailyConfig.presetBlocksTotal - countRemainingPresetBlocks(grid)}
        dailyConfig={dailyConfig}
        onPlayAgain={() => startDailyGame(dailyConfig)}
        onOpenLeaderboard={() => {
          setIsDailyVictoryModalOpen(false);
          setIsLeaderboardModalOpen(true);
        }}
        onClose={() => setIsDailyVictoryModalOpen(false)}
      />

      <GameOverModal
        isOpen={isGameOverModalOpen}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        linesCleared={linesClearedTotal}
        maxCombo={maxCombo}
        onPlayAgain={startNewGame}
      />

      <HowToPlayModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
