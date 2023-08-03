import { HitBox } from './types';
// import { drawCollisionBox } from './util';

export abstract class FallingObject {
  protected yPos: number;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected xPos: number,
    protected dy: number,
    protected image: ImageBitmap | null = null,
  ) {
    this.yPos = -25;
  }

  get y() {
    return this.yPos;
  }

  get w() {
    return this.image?.width ?? 0;
  }

  get h() {
    return this.image?.height ?? 0;
  }

  abstract get hitbox(): HitBox;

  draw(): void {
    if (this.image !== null) {
      if (this.xPos > this.ctx.canvas.width - this.w) {
        this.xPos -= this.w;
      }
      this.ctx.drawImage(this.image, this.xPos, this.yPos);
      // drawCollisionBox(this.ctx, this.hitbox);
    }
  }

  update(secondsPassed: number): void {
    this.yPos += this.dy * secondsPassed;
  }
}
