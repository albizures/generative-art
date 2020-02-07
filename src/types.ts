export interface Size {
  width: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

type Attach = () => void;
type UnAttach = () => void;

export type Piece = (
  canvas: HTMLCanvasElement
) => {
  attach: Attach;
  unAttach: UnAttach;
};
