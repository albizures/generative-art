import { Piece } from "../types";
import { clean, background } from "../utils/canvas";
import { getRandomItem } from "../utils";
import { register } from "../register";

const colors = ["#00F1FF", "#0161E8", "#290CFF", "#9B00E8", "#FF019A"];

const createPiece: Piece = (canvas: HTMLCanvasElement) => {
  let context: CanvasRenderingContext2D;

  function draw(x: number, y: number, width: number, height: number) {
    const leftToRight = Math.random() >= 0.5;
    context.beginPath();
    if (leftToRight) {
      context.moveTo(x, y);
      context.lineTo(x + width, y + height);
    } else {
      context.moveTo(x + width, y);
      context.lineTo(x, y + height);
    }

    context.strokeStyle = getRandomItem(colors);
    context.stroke();
  }

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

    const step = 20;

    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        draw(x, y, step, step);
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

register("1", createPiece);
