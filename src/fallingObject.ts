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

  get hitbox(): number[] {
    return [this.xPos, this.yPos, this.w, this.h];
  }

  draw(): void {
    if (this.image !== null) {
      if (this.xPos > this.ctx.canvas.width - this.w) {
        this.xPos -= this.w;
      }
      this.ctx.drawImage(this.image, this.xPos, this.yPos);
      // this.drawCollisionBox();
    }
  }

  drawCollisionBox() {
    const [x, y, w, h] = this.hitbox;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(x, y, w, h);
  }

  update(secondsPassed: number): void {
    this.yPos += this.dy * secondsPassed;
  }
}
