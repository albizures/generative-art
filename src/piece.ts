import { Size } from "./types";

type PieceSize = number | Size;

interface PieceConfig {
  name: string;
  size?: PieceSize;
  setup?: () => void;
  paint: () => void;
}

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

interface PieceData {
  context: CanvasRenderingContext2D;
  size: Size;
}

const pieces = new Map<string, Piece>();
const pieceData = new Map<string, PieceData>();

const defaultSetup = () => {
  const context = useContext();
  const { canvas } = context;
  const { width, height } = useSize();

  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  context.lineCap = "square";
  context.lineWidth = 2;
};

const Piece = (config: PieceConfig) => {
  const { setup = noop, paint, size: rawSize = 320, name } = config;

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

  const data = {
    context,
    size
  };

  pieceData.set(name, data);

  currentPieceData = data;
  defaultSetup();
  setup();
  paint();

  const piece = {
    attach() {
      const [wall] = document.getElementsByClassName("wall");

      wall.appendChild(container);
    }
  };
  pieces.set(name, piece);

  return piece;
};

let currentPieceData: PieceData;

const useContext = () => {
  return currentPieceData.context;
};

const useSize = () => {
  return currentPieceData.size;
};

export { Piece, Piece as create, pieces, useContext, useSize };
