import "./pieces/*.ts";
import { getPiece } from "./register";

const canvas1 = document.getElementById("canvas1") as HTMLCanvasElement;
const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
const canvas3 = document.getElementById("canvas3") as HTMLCanvasElement;

getPiece("1", canvas1).attach();
getPiece("2", canvas2).attach();
getPiece("3", canvas3).attach();
