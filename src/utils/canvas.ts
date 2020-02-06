type Context = CanvasRenderingContext2D;
const clean = (context: Context) => {
  context.canvas.width = context.canvas.width;
};

const background = (context: Context, color: string) => {
  context.save();
  context.fillStyle = color;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
};

export { clean, background };
