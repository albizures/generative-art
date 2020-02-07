import { Size } from "./types";

interface PieceState {
  useCanvas: () => HTMLCanvasElement;
  useContext: () => CanvasRenderingContext2D;
  useSize: () => Size;
}

type PieceSize = number | Size;

interface PieceActions {
  name: string;
  size?: PieceSize;
  setup?: (piece: PieceState) => void;
  paint: (piece: PieceState) => void;
}

type PieceFactory = () => PieceActions;

const createDiv = (className: string) => {
  const div = document.createElement("div");

  div.className = className;

  return div;
};

const noop = () => undefined;

const parseSize = (size: PieceSize): Size => {
  if (typeof size === "number") {
    return {
      width: size,
      height: size
    };
  }

  return size;
};

interface Piece {
  attach: () => void;
}

const pieces = new Map<string, Piece>();

const Piece = (factory: PieceFactory) => {
  const { setup = noop, paint, size: rawSize = 320, name } = factory();

  if (pieces.has(name)) {
    throw new Error(`Name already used: '${name}'`);
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const container = createDiv("piece");
  const frame = createDiv("frame");

  container.appendChild(frame);
  frame.appendChild(canvas);

  const size = parseSize(rawSize);
  const { width, height } = size;

  const piece = {
    useCanvas: () => canvas,
    useContext: () => context,
    useSize: () => size
  };

  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  context.lineCap = "square";
  context.lineWidth = 2;

  setup(piece);
  paint(piece);

  pieces.set(name, {
    attach() {
      const [wall] = document.getElementsByClassName("wall");

      wall.appendChild(container);
    }
  });
};

export { Piece, pieces };
