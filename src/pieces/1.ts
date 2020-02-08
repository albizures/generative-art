import * as Piece from "../piece";
import { background } from "../utils/canvas";
import { cyberpunk } from "../palettes";
import { getRandomItem } from "../utils";
import { Vector, Size } from "../types";

const setup = () => {
  const context = Piece.useContext();
  background(context, "black");
};

const draw = (position: Vector, size: Size) => {
  const context = Piece.useContext();
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
};

const paint = () => {
  const { width, height } = Piece.useSize();
  const step = 20;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      draw({ x, y }, { width: step, height: step });
    }
  }
};

Piece.create({
  name: "1",
  setup,
  paint
});
