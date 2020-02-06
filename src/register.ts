import { Piece } from "./types";

const pieces: Record<string, Piece> = {};

const register = (name: string, piece: Piece) => {
  pieces[name] = piece;
};

const getPiece = (name: string, canvas: HTMLCanvasElement) => {
  return pieces[name](canvas);
};

export { register, getPiece };
