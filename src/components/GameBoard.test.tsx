import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GameBoard } from './GameBoard';
import { createEmptyBoard, TETROMINOES, type Tetromino } from '@/lib/tetris';

describe('GameBoard Component', () => {
  it('should render without crashing', () => {
    const board = createEmptyBoard();
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render canvas with correct dimensions', () => {
    const board = createEmptyBoard();
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(300); // BOARD_WIDTH * CELL_SIZE = 10 * 30
    expect(canvas.height).toBe(600); // BOARD_HEIGHT * CELL_SIZE = 20 * 30
  });

  it('should render with a current piece', () => {
    const board = createEmptyBoard();
    const currentPiece: Tetromino = {
      type: 'T',
      shape: TETROMINOES.T.shape,
      color: TETROMINOES.T.color,
      position: { x: 4, y: 0 },
    };
    
    const { container } = render(
      <GameBoard board={board} currentPiece={currentPiece} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render game over state', () => {
    const board = createEmptyBoard();
    
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={true} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render with filled cells on board', () => {
    const board = createEmptyBoard();
    board[19][5] = { filled: true, color: 'red' };
    
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
