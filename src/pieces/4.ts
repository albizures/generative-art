import * as Piece from '../_Piece';
import { Vector } from '../types';
import { background } from '../utils/canvas';
import { getRandomItem } from '../utils';
import { cyberpunk } from '../palettes';

type Lines = Vector[][];

const setup = () => {
  const context = Piece.useContext();
  context.lineJoin = 'bevel';
  context.lineWidth = 1;

  background(context, 'black');
};

function drawTriangle(pointA: Vector, pointB: Vector, pointC: Vector) {
  const context = Piece.useContext();

  context.beginPath();
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);
  context.lineTo(pointC.x, pointC.y);
  context.lineTo(pointA.x, pointA.y);
  context.closePath();
  context.strokeStyle = 'black';
  context.fillStyle = getRandomItem(cyberpunk);
  context.fill();
  context.stroke();
}

const createLines = (gap: number, offset: number) => {
  const { width, height } = Piece.useSize();
  const lines = [];
  let odd = false;

  for (let y = gap / 2 + offset; y <= height - offset; y += gap) {
    const line = [];
    odd = !odd;

    for (let x = gap / 4 + offset; x <= width - offset; x += gap) {
      const point = {
        x: x + (Math.random() * 0.8 - 0.4) * gap + (odd ? gap / 2 : 0),
        y: y + (Math.random() * 0.8 - 0.4) * gap,
      };

      line.push(point);
    }
    lines.push(line);
  }

  return lines;
};

const drawLines = (lines: Lines) => {
  let odd = true;

  for (let y = 0; y < lines.length - 1; y++) {
    odd = !odd;
    const dotLine = [];

    for (let i = 0; i < lines[y].length; i++) {
      if (odd) {
        dotLine.push(lines[y][i]);
        dotLine.push(lines[y + 1][i]);
      } else {
        dotLine.push(lines[y + 1][i]);
        dotLine.push(lines[y][i]);
      }
    }

    for (let i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2]);
    }
  }
};

const paint = () => {
  const { width } = Piece.useSize();
  const context = Piece.useContext();
  context.lineJoin = 'bevel';
  context.lineCap = 'square';
  context.lineWidth = 1;

  background(context, 'black');

  const offset = 30;
  const gap = width / 7;
  const lines = createLines(gap, offset);

  drawLines(lines);
};

Piece.create({
  name: '4',
  paint,
  setup,
});
