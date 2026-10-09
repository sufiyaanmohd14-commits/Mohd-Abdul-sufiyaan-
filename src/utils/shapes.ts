import { ShapeDefinition } from '../types/game';

export const SHAPES: ShapeDefinition[] = [
  // 1x1 Single block
  {
    id: 'dot-1x1',
    name: 'Single Dot',
    matrix: [[1]],
    color: '#38BDF8', // Sky 400
    glowColor: '#0284C7',
    borderColor: '#BAE6FD',
    weight: 12,
  },

  // 1x2 and 2x1 Dominoes
  {
    id: 'line-1x2',
    name: '1x2 Bar',
    matrix: [[1, 1]],
    color: '#34D399', // Emerald 400
    glowColor: '#059669',
    borderColor: '#A7F3D0',
    weight: 10,
  },
  {
    id: 'line-2x1',
    name: '2x1 Bar',
    matrix: [[1], [1]],
    color: '#34D399',
    glowColor: '#059669',
    borderColor: '#A7F3D0',
    weight: 10,
  },

  // 1x3 and 3x1 Trios
  {
    id: 'line-1x3',
    name: '1x3 Bar',
    matrix: [[1, 1, 1]],
    color: '#60A5FA', // Blue 400
    glowColor: '#2563EB',
    borderColor: '#BFDBFE',
    weight: 9,
  },
  {
    id: 'line-3x1',
    name: '3x1 Bar',
    matrix: [[1], [1], [1]],
    color: '#60A5FA',
    glowColor: '#2563EB',
    borderColor: '#BFDBFE',
    weight: 9,
  },

  // 1x4 and 4x1 Tetromino lines
  {
    id: 'line-1x4',
    name: '1x4 Bar',
    matrix: [[1, 1, 1, 1]],
    color: '#818CF8', // Indigo 400
    glowColor: '#4F46E5',
    borderColor: '#C7D2FE',
    weight: 7,
  },
  {
    id: 'line-4x1',
    name: '4x1 Bar',
    matrix: [[1], [1], [1], [1]],
    color: '#818CF8',
    glowColor: '#4F46E5',
    borderColor: '#C7D2FE',
    weight: 7,
  },

  // 1x5 and 5x1 Long bars
  {
    id: 'line-1x5',
    name: '1x5 Bar',
    matrix: [[1, 1, 1, 1, 1]],
    color: '#A855F7', // Purple 500
    glowColor: '#7E22CE',
    borderColor: '#E9D5FF',
    weight: 4,
  },
  {
    id: 'line-5x1',
    name: '5x1 Bar',
    matrix: [[1], [1], [1], [1], [1]],
    color: '#A855F7',
    glowColor: '#7E22CE',
    borderColor: '#E9D5FF',
    weight: 4,
  },

  // 2x2 Square
  {
    id: 'square-2x2',
    name: '2x2 Square',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: '#FBBF24', // Amber 400
    glowColor: '#D97706',
    borderColor: '#FDE68A',
    weight: 9,
  },

  // 3x3 Square
  {
    id: 'square-3x3',
    name: '3x3 Giant Square',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#EF4444', // Red 500
    glowColor: '#B91C1C',
    borderColor: '#FECACA',
    weight: 3,
  },

  // 2x2 Corner L (4 orientations)
  {
    id: 'corner-2x2-tl',
    name: '2x2 Corner Top-Left',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    color: '#FB923C', // Orange 400
    glowColor: '#EA580C',
    borderColor: '#FFEDD5',
    weight: 8,
  },
  {
    id: 'corner-2x2-tr',
    name: '2x2 Corner Top-Right',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    color: '#FB923C',
    glowColor: '#EA580C',
    borderColor: '#FFEDD5',
    weight: 8,
  },
  {
    id: 'corner-2x2-bl',
    name: '2x2 Corner Bottom-Left',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: '#FB923C',
    glowColor: '#EA580C',
    borderColor: '#FFEDD5',
    weight: 8,
  },
  {
    id: 'corner-2x2-br',
    name: '2x2 Corner Bottom-Right',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    color: '#FB923C',
    glowColor: '#EA580C',
    borderColor: '#FFEDD5',
    weight: 8,
  },

  // 3x3 Large L-shapes
  {
    id: 'l-3x3-tl',
    name: '3x3 L Top-Left',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#EC4899', // Pink 500
    glowColor: '#BE185D',
    borderColor: '#FCE7F3',
    weight: 5,
  },
  {
    id: 'l-3x3-tr',
    name: '3x3 L Top-Right',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#EC4899',
    glowColor: '#BE185D',
    borderColor: '#FCE7F3',
    weight: 5,
  },
  {
    id: 'l-3x3-bl',
    name: '3x3 L Inverted Top-Left',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    color: '#EC4899',
    glowColor: '#BE185D',
    borderColor: '#FCE7F3',
    weight: 5,
  },
  {
    id: 'l-3x3-br',
    name: '3x3 L Inverted Top-Right',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    color: '#EC4899',
    glowColor: '#BE185D',
    borderColor: '#FCE7F3',
    weight: 5,
  },

  // T-shapes
  {
    id: 't-up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#14B8A6', // Teal 500
    glowColor: '#0F766E',
    borderColor: '#CCFBF1',
    weight: 6,
  },
  {
    id: 't-down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#14B8A6',
    glowColor: '#0F766E',
    borderColor: '#CCFBF1',
    weight: 6,
  },
  {
    id: 't-left',
    name: 'T-Shape Left',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: '#14B8A6',
    glowColor: '#0F766E',
    borderColor: '#CCFBF1',
    weight: 6,
  },
  {
    id: 't-right',
    name: 'T-Shape Right',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: '#14B8A6',
    glowColor: '#0F766E',
    borderColor: '#CCFBF1',
    weight: 6,
  },

  // Z and S shapes
  {
    id: 'z-shape',
    name: 'Z-Tetromino',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#F43F5E', // Rose 500
    glowColor: '#BE123C',
    borderColor: '#FFE4E6',
    weight: 6,
  },
  {
    id: 's-shape',
    name: 'S-Tetromino',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#10B981', // Emerald 500
    glowColor: '#047857',
    borderColor: '#D1FAE5',
    weight: 6,
  },
  {
    id: 'z-vert',
    name: 'Z-Tetromino Vertical',
    matrix: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: '#F43F5E',
    glowColor: '#BE123C',
    borderColor: '#FFE4E6',
    weight: 6,
  },
  {
    id: 's-vert',
    name: 'S-Tetromino Vertical',
    matrix: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    color: '#10B981',
    glowColor: '#047857',
    borderColor: '#D1FAE5',
    weight: 6,
  },

  // 2x3 and 3x2 Rectangles
  {
    id: 'rect-2x3',
    name: '2x3 Rectangle',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#F59E0B', // Amber 500
    glowColor: '#B45309',
    borderColor: '#FEF3C7',
    weight: 4,
  },
  {
    id: 'rect-3x2',
    name: '3x2 Rectangle',
    matrix: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    color: '#F59E0B',
    glowColor: '#B45309',
    borderColor: '#FEF3C7',
    weight: 4,
  },
];

// Weighted random picker for shapes
export function getRandomShape(): ShapeDefinition {
  const totalWeight = SHAPES.reduce((sum, s) => sum + s.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const shape of SHAPES) {
    if (randomVal < shape.weight) {
      return shape;
    }
    randomVal -= shape.weight;
  }

  return SHAPES[0];
}

// Generate a set of 3 shapes for the tray
export function generateTrayShapes(): ShapeDefinition[] {
  // Ensure that at least 1 or 2 smaller/easier pieces are present so the player is less likely to be hard-locked immediately
  const pieces: ShapeDefinition[] = [];
  for (let i = 0; i < 3; i++) {
    pieces.push(getRandomShape());
  }
  return pieces;
}
