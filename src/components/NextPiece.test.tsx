import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NextPiece } from './NextPiece';
import { TETROMINOES, type Tetromino } from '@/lib/tetris';

describe('NextPiece Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render with a tetromino', () => {
    const nextPiece: Tetromino = {
      type: 'I',
      shape: TETROMINOES.I.shape,
      color: TETROMINOES.I.color,
      position: { x: 0, y: 0 },
    };
    
    const { container } = render(<NextPiece nextPiece={nextPiece} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render canvas with correct dimensions', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(120); // 4 * CELL_SIZE = 4 * 30
    expect(canvas.height).toBe(120);
  });

  it('should render all tetromino types', () => {
    const types: Array<keyof typeof TETROMINOES> = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    types.forEach(type => {
      const nextPiece: Tetromino = {
        type,
        shape: TETROMINOES[type].shape,
        color: TETROMINOES[type].color,
        position: { x: 0, y: 0 },
      };
      
      const { container } = render(<NextPiece nextPiece={nextPiece} />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeTruthy();
    });
  });
});
