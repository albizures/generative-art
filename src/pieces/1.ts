import { Piece } from "../piece";
import { background } from "../utils/canvas";
import { cyberpunk } from "../palettes";
import { getRandomItem } from "../utils";

Piece(() => ({
  name: "1",
  setup(piece) {
    const context = piece.useContext();
    background(context, "black");
  },
  paint(piece) {
    const context = piece.useContext();
    const { width, height } = piece.useSize();
    const step = 20;

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

      context.strokeStyle = getRandomItem(cyberpunk);
      context.stroke();
    }

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        draw(x, y, step, step);
      }
    }
  }
}));
