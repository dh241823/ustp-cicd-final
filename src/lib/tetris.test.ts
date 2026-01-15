import { describe, it, expect } from 'vitest';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createEmptyBoard,
  getRandomTetromino,
  rotateTetromino,
  checkCollision,
  mergeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  TETROMINOES,
  type Tetromino,
  type Cell,
} from './tetris';

describe('Tetris Game Logic', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
    });

    it('should create a board with all empty cells', () => {
      const board = createEmptyBoard();
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell.filled).toBe(false);
          expect(cell.color).toBe('');
        });
      });
    });
  });

  describe('getRandomTetromino', () => {
    it('should return a valid tetromino', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino).toBeDefined();
      expect(tetromino.type).toBeDefined();
      expect(tetromino.shape).toBeDefined();
      expect(tetromino.color).toBeDefined();
      expect(tetromino.position).toBeDefined();
    });

    it('should position tetromino near the center', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino.position.y).toBe(0);
      expect(tetromino.position.x).toBeGreaterThanOrEqual(0);
      expect(tetromino.position.x).toBeLessThan(BOARD_WIDTH);
    });

    it('should create a copy of the shape (not reference)', () => {
      const tetromino = getRandomTetromino();
      const originalShape = TETROMINOES[tetromino.type].shape;
      expect(tetromino.shape).not.toBe(originalShape);
      expect(tetromino.shape).toEqual(originalShape);
    });
  });

  describe('rotateTetromino', () => {
    it('should rotate I piece correctly', () => {
      const iPiece: Tetromino = {
        type: 'I',
        shape: TETROMINOES.I.shape.map(row => [...row]),
        color: TETROMINOES.I.color,
        position: { x: 0, y: 0 },
      };

      const rotated = rotateTetromino(iPiece);
      expect(rotated).toBeDefined();
      expect(rotated.length).toBe(iPiece.shape.length);
    });

    it('should rotate O piece (should remain same)', () => {
      const oPiece: Tetromino = {
        type: 'O',
        shape: TETROMINOES.O.shape.map(row => [...row]),
        color: TETROMINOES.O.color,
        position: { x: 0, y: 0 },
      };

      const rotated = rotateTetromino(oPiece);
      expect(rotated).toEqual(oPiece.shape);
    });

    it('should rotate T piece correctly', () => {
      const tPiece: Tetromino = {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: TETROMINOES.T.color,
        position: { x: 0, y: 0 },
      };

      const rotated = rotateTetromino(tPiece);
      const expected = [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ];
      expect(rotated).toEqual(expected);
    });

    it('should perform 4 rotations to return to original', () => {
      const tPiece: Tetromino = {
        type: 'T',
        shape: TETROMINOES.T.shape.map(row => [...row]),
        color: TETROMINOES.T.color,
        position: { x: 0, y: 0 },
      };

      let rotated = tPiece.shape;
      for (let i = 0; i < 4; i++) {
        rotated = rotateTetromino({ ...tPiece, shape: rotated });
      }
      expect(rotated).toEqual(tPiece.shape);
    });
  });

  describe('checkCollision', () => {
    it('should detect collision with left wall', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'I',
        shape: [[1, 1, 1, 1]],
        color: 'blue',
        position: { x: 0, y: 0 },
      };

      expect(checkCollision(board, tetromino, -1, 0)).toBe(true);
    });

    it('should detect collision with right wall', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'I',
        shape: [[1, 1, 1, 1]],
        color: 'blue',
        position: { x: BOARD_WIDTH - 4, y: 0 },
      };

      expect(checkCollision(board, tetromino, 1, 0)).toBe(true);
    });

    it('should detect collision with bottom', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: [[1, 1], [1, 1]],
        color: 'yellow',
        position: { x: 4, y: BOARD_HEIGHT - 2 },
      };

      expect(checkCollision(board, tetromino, 0, 1)).toBe(true);
    });

    it('should detect collision with filled cells', () => {
      const board = createEmptyBoard();
      board[19][5] = { filled: true, color: 'red' };

      const tetromino: Tetromino = {
        type: 'O',
        shape: [[1, 1], [1, 1]],
        color: 'yellow',
        position: { x: 4, y: 18 },
      };

      expect(checkCollision(board, tetromino, 0, 1)).toBe(true);
    });

    it('should not detect collision when there is space', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: [[1, 1], [1, 1]],
        color: 'yellow',
        position: { x: 4, y: 5 },
      };

      expect(checkCollision(board, tetromino, 0, 1)).toBe(false);
      expect(checkCollision(board, tetromino, 1, 0)).toBe(false);
      expect(checkCollision(board, tetromino, -1, 0)).toBe(false);
    });
  });

  describe('mergeTetromino', () => {
    it('should merge tetromino into board', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: [[1, 1], [1, 1]],
        color: 'yellow',
        position: { x: 4, y: 18 },
      };

      const newBoard = mergeTetromino(board, tetromino);

      expect(newBoard[18][4].filled).toBe(true);
      expect(newBoard[18][5].filled).toBe(true);
      expect(newBoard[19][4].filled).toBe(true);
      expect(newBoard[19][5].filled).toBe(true);
      expect(newBoard[18][4].color).toBe('yellow');
    });

    it('should not modify original board', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: [[1, 1], [1, 1]],
        color: 'yellow',
        position: { x: 4, y: 18 },
      };

      mergeTetromino(board, tetromino);

      expect(board[18][4].filled).toBe(false);
      expect(board[19][4].filled).toBe(false);
    });

    it('should merge only filled cells of tetromino', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: 'purple',
        position: { x: 4, y: 17 },
      };

      const newBoard = mergeTetromino(board, tetromino);

      expect(newBoard[17][5].filled).toBe(true);
      expect(newBoard[18][4].filled).toBe(true);
      expect(newBoard[18][5].filled).toBe(true);
      expect(newBoard[18][6].filled).toBe(true);
      expect(newBoard[17][4].filled).toBe(false);
      expect(newBoard[17][6].filled).toBe(false);
    });
  });

  describe('clearLines', () => {
    it('should clear a single full line', () => {
      const board = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = { filled: true, color: 'red' };
      }

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(1);
      expect(newBoard[19].every(cell => !cell.filled)).toBe(true);
    });

    it('should clear multiple full lines', () => {
      const board = createEmptyBoard();
      for (let y = 18; y < 20; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = { filled: true, color: 'red' };
        }
      }

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(2);
      expect(newBoard[18].every(cell => !cell.filled)).toBe(true);
      expect(newBoard[19].every(cell => !cell.filled)).toBe(true);
    });

    it('should not clear partial lines', () => {
      const board = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[19][x] = { filled: true, color: 'red' };
      }

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(0);
      expect(newBoard[19].filter(cell => cell.filled).length).toBe(BOARD_WIDTH - 1);
    });

    it('should maintain board height after clearing', () => {
      const board = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = { filled: true, color: 'red' };
      }

      const { newBoard } = clearLines(board);

      expect(newBoard).toHaveLength(BOARD_HEIGHT);
    });

    it('should add empty rows at the top', () => {
      const board = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[19][x] = { filled: true, color: 'red' };
      }

      const { newBoard } = clearLines(board);

      expect(newBoard[0].every(cell => !cell.filled)).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should return 0 for no lines cleared', () => {
      expect(calculateScore(0, 1)).toBe(0);
    });

    it('should calculate single line score', () => {
      expect(calculateScore(1, 1)).toBe(100);
      expect(calculateScore(1, 2)).toBe(200);
      expect(calculateScore(1, 5)).toBe(500);
    });

    it('should calculate double line score', () => {
      expect(calculateScore(2, 1)).toBe(300);
      expect(calculateScore(2, 3)).toBe(900);
    });

    it('should calculate triple line score', () => {
      expect(calculateScore(3, 1)).toBe(500);
      expect(calculateScore(3, 2)).toBe(1000);
    });

    it('should calculate tetris (4 lines) score', () => {
      expect(calculateScore(4, 1)).toBe(800);
      expect(calculateScore(4, 5)).toBe(4000);
    });

    it('should scale score with level', () => {
      expect(calculateScore(1, 10)).toBe(1000);
      expect(calculateScore(4, 10)).toBe(8000);
    });
  });

  describe('calculateLevel', () => {
    it('should start at level 1', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(5)).toBe(1);
      expect(calculateLevel(9)).toBe(1);
    });

    it('should increase level every 10 lines', () => {
      expect(calculateLevel(10)).toBe(2);
      expect(calculateLevel(15)).toBe(2);
      expect(calculateLevel(19)).toBe(2);
      expect(calculateLevel(20)).toBe(3);
      expect(calculateLevel(100)).toBe(11);
    });
  });

  describe('getDropSpeed', () => {
    it('should start at 1000ms for level 1', () => {
      expect(getDropSpeed(1)).toBe(1000);
    });

    it('should decrease drop speed with level', () => {
      expect(getDropSpeed(2)).toBe(900);
      expect(getDropSpeed(3)).toBe(800);
      expect(getDropSpeed(5)).toBe(600);
    });

    it('should have a minimum drop speed of 100ms', () => {
      expect(getDropSpeed(10)).toBe(100);
      expect(getDropSpeed(20)).toBe(100);
      expect(getDropSpeed(100)).toBe(100);
    });
  });

  describe('TETROMINOES constants', () => {
    it('should have all 7 tetromino types', () => {
      const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach(type => {
        expect(TETROMINOES[type as keyof typeof TETROMINOES]).toBeDefined();
      });
    });

    it('should have shape and color for each tetromino', () => {
      Object.values(TETROMINOES).forEach(tetromino => {
        expect(tetromino.shape).toBeDefined();
        expect(tetromino.color).toBeDefined();
        expect(Array.isArray(tetromino.shape)).toBe(true);
        expect(typeof tetromino.color).toBe('string');
      });
    });
  });
});
