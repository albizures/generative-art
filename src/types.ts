type Attach = () => void;
type UnAttach = () => void;

export type Piece = (
  canvas: HTMLCanvasElement
) => {
  attach: Attach;
  unAttach: UnAttach;
};
