import { Piece } from "../types";
import { clean, background } from "../utils/canvas";
import { distanceToCenter } from "../utils";
import { register } from "../register";

const firstColor = {
  r: 0,
  g: 241,
  b: 255
};

const secondColor = {
  r: 255,
  g: 1,
  b: 154
};

const getStepRation = (steps: number, first: number, second: number) => {
  return (second - first) / steps;
};

const fromFirstToSecondColor = (steps: number, currentStep: number) => {
  const ratioR = getStepRation(steps, firstColor.r, secondColor.r);
  const ratioG = getStepRation(steps, firstColor.b, secondColor.b);
  const ratioB = getStepRation(steps, firstColor.g, secondColor.g);

  return {
    r: firstColor.r + ratioR * currentStep,
    g: firstColor.g + ratioG * currentStep,
    b: firstColor.b + ratioB * currentStep
  };
};

const createPiece: Piece = (canvas: HTMLCanvasElement) => {
  let context: CanvasRenderingContext2D;

  const attach = () => {
    context = canvas.getContext("2d");

    const size = 320;
    const dpr = window.devicePixelRatio;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.scale(dpr, dpr);

    context.lineCap = "square";
    context.lineWidth = 2;

    background(context, "black");

    const step = 10;
    const lines = [];

    for (let i = step + 45; i <= size - step; i += step) {
      const line = [];
      for (let j = step; j <= size - step; j += step) {
        const variance = Math.max(
          size / 2 - (50 + lines.length * 4) - distanceToCenter(size, j),
          0
        );

        const random = ((Math.random() * variance) / 2) * -1;
        const point = { x: j > size - step ? size - step : j, y: i + random };
        line.push(point);
      }
      const lastPoint = line[line.length - 1];

      if (lastPoint.x < size) {
        lastPoint.x = size;
      }

      lines.push(line);
    }

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
      const color = fromFirstToSecondColor(lines.length, i);
      context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      context.stroke();
    }
  };
  const unAttach = () => {
    clean(context);
  };

  return {
    attach: () => setTimeout(attach, 100),
    unAttach
  };
};

register("2", createPiece);
