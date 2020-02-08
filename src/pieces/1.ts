import { Piece } from "../piece";
import { background } from "../utils/canvas";
import { cyberpunk } from "../palettes";
import { getRandomItem } from "../utils";
import { Vector, Size } from "../types";

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

    function draw(position: Vector, size: Size) {
      const leftToRight = Math.random() >= 0.5;
      context.beginPath();
      if (leftToRight) {
        context.moveTo(position.x, position.y);
        context.lineTo(position.x + size.width, position.y + size.height);
      } else {
        context.moveTo(position.x + size.width, position.y);
        context.lineTo(position.x, position.y + size.height);
      }

      context.strokeStyle = getRandomItem(cyberpunk);
      context.stroke();
    }

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        draw({ x, y }, { width: step, height: step });
      }
    }
  }
}));
