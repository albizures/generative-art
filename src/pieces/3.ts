import { Piece } from "../types";
import { clean, background } from "../utils/canvas";
import { register } from "../register";
import { getRandomItem, plusOrMinus } from "../utils";

const colors = ["#00F1FF", "#0161E8", "#290CFF", "#9B00E8", "#FF019A"];

const createPiece: Piece = (canvas: HTMLCanvasElement) => {
  let context: CanvasRenderingContext2D;

  function draw(width: number, height: number) {
    context.beginPath();
    context.rect(0, 0, width, height);
    context.strokeStyle = getRandomItem(colors);
    context.stroke();
  }

  const attach = () => {
    context = canvas.getContext("2d");

    const squareSize = 30;
    const offset = 10;
    const size = squareSize * 10 + offset * 2;
    const dpr = window.devicePixelRatio;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.scale(dpr, dpr);

    context.lineCap = "square";
    context.lineWidth = 2;

    background(context, "black");

    const randomDisplacement = 15;
    const rotateMultiplier = 20;

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const rotateAmt =
          ((y * 0.1 * Math.PI) / 180) *
          plusOrMinus() *
          Math.random() *
          rotateMultiplier;

        const translateAmt =
          y * 0.04 * plusOrMinus() * Math.random() * randomDisplacement;

        context.save();
        context.translate(
          x * squareSize + offset + translateAmt,
          y * squareSize + offset + translateAmt * plusOrMinus()
        );
        context.rotate(rotateAmt);
        draw(squareSize, squareSize);
        context.restore();
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

register("3", createPiece);
