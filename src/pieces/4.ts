import { Piece } from "../types";
import { clean, background } from "../utils/canvas";
import { getRandomItem, distanceToCenter } from "../utils";
import { register } from "../register";

interface Point {
  x: number;
  y: number;
}

const colors = ["#00F1FF", "#0161E8", "#290CFF", "#9B00E8", "#FF019A"];

const createPiece: Piece = (canvas: HTMLCanvasElement) => {
  let context: CanvasRenderingContext2D;

  function drawTriangle(pointA: Point, pointB: Point, pointC: Point) {
    context.beginPath();
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);
    context.lineTo(pointC.x, pointC.y);
    context.lineTo(pointA.x, pointA.y);
    context.closePath();
    context.strokeStyle = "black"; // getRandomItem(colors);
    context.fillStyle = getRandomItem(colors);
    context.fill();
    context.stroke();
  }

  const attach = () => {
    context = canvas.getContext("2d");

    const size = 320;
    const dpr = window.devicePixelRatio;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.scale(dpr, dpr);

    context.lineJoin = "bevel";
    context.lineCap = "square";
    context.lineWidth = 1;

    background(context, "black");

    const offset = 30;
    const lines = [];
    const gap = size / 7;

    let odd = false;

    for (let y = gap / 2 + offset; y <= size - offset; y += gap) {
      const line = [];
      odd = !odd;

      for (let x = gap / 4 + offset; x <= size - offset; x += gap) {
        const point = {
          x: x + (Math.random() * 0.8 - 0.4) * gap + (odd ? gap / 2 : 0),
          y: y + (Math.random() * 0.8 - 0.4) * gap
        };

        line.push(point);
      }
      lines.push(line);
    }

    odd = true;

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
  const unAttach = () => {
    clean(context);
  };

  return {
    attach: () => setTimeout(attach, 100),
    unAttach
  };
};

register("4", createPiece);
