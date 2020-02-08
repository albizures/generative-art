import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { fromFirstToSecondColor } from '../utils/colors';
import { distanceToCenter } from '../utils';
import { Vector } from '../types';

const firstColor = {
  r: 0,
  g: 241,
  b: 255,
};

const secondColor = {
  r: 255,
  g: 1,
  b: 154,
};

type Lines = Vector[][];

const setup = () => {
  const context = Piece.useContext();
  background(context, 'black');
};

const createLines = (step: number): Lines => {
  const { width, height } = Piece.useSize();
  const lines = [];

  for (let i = step + 45; i <= height - step; i += step) {
    const line = [];
    for (let j = step; j <= width - step; j += step) {
      const variance = Math.max(
        width / 2 - (50 + lines.length * 4) - distanceToCenter(width, j),
        0,
      );

      const random = ((Math.random() * variance) / 2) * -1;
      const point = { x: j > width - step ? width - step : j, y: i + random };
      line.push(point);
    }
    const lastPoint = line[line.length - 1];

    if (lastPoint.x < width) {
      lastPoint.x = width;
    }

    lines.push(line);
  }

  return lines;
};

const paintLines = (lines: Lines) => {
  const context = Piece.useContext();
  const colors = fromFirstToSecondColor(firstColor, secondColor, lines.length);
  for (let i = 0; i < lines.length; i++) {
    context.beginPath();
    context.moveTo(lines[i][0].x, lines[i][0].y);
    for (var j = 0; j < lines[i].length - 1; j++) {
      const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }

    context.save();
    context.fill();
    context.restore();
    const color = colors.next().value;
    if (color) {
      context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    context.stroke();
  }
};

const paint = () => {
  const step = 10;
  const lines = createLines(step);

  paintLines(lines);
};

Piece.create({
  name: '2',
  paint,
  setup,
});
