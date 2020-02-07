import { Piece } from "../piece";
import { fromFirstToSecondColor } from "../utils/colors";
import { background } from "../utils/canvas";
import { Vector, Size } from "../types";

const firstColor = {
  r: 255,
  g: 1,
  b: 154
};

const secondColor = {
  r: 0,
  g: 241,
  b: 255
};

Piece(() => ({
  name: "5",
  setup(piece) {
    const context = piece.useContext();
    background(context, "black");
  },
  paint(piece) {
    const context = piece.useContext();
    const { height, width } = piece.useSize();

    context.lineWidth = 4;
    context.lineCap = "round";

    var step = 20;
    var aThirdOfHeight = height / 3;

    function draw(
      { x, y }: Vector,
      { width, height }: Size,
      positions: number[]
    ) {
      context.save();
      context.translate(x + width / 2, y + height / 2);
      context.rotate(Math.random() * 5);
      context.translate(-width / 2, -height / 2);

      for (var i = 0; i <= positions.length; i++) {
        context.beginPath();
        context.moveTo(positions[i] * width, 0);
        context.lineTo(positions[i] * width, height);
        context.stroke();
      }

      context.restore();
    }

    const colors = fromFirstToSecondColor(
      firstColor,
      secondColor,
      (height - step) / step
    );
    for (var y = step; y < height - step; y += step) {
      const color = colors.next().value;
      for (var x = step; x < width - step; x += step) {
        const positions = { x, y };
        const size = {
          width: step,
          height: step
        };

        if (color) {
          context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }

        if (y < aThirdOfHeight) {
          draw(positions, size, [0.5]);
        } else if (y < aThirdOfHeight * 2) {
          draw(positions, size, [0.2, 0.8]);
        } else {
          draw(positions, size, [0.1, 0.5, 0.9]);
        }
      }
    }
  }
}));
