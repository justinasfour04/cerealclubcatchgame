export default abstract class FallingObject {
  protected yPos: number;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected xPos: number,
    protected dy: number,
  ) {
    this.yPos = -25;
  }

  get y() {
    return this.yPos;
  }

  abstract get hitbox(): number[];
  abstract draw(): void;
  abstract update(secondsPassed: number): void;
}
