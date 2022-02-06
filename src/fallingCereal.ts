import FallingObject from './fallingObject';

export default class FallingCereal extends FallingObject {
  get hitbox(): number[] {
    return [this.xPos, this.yPos, this.xPos + 40, this.yPos + 40];
  }

  draw(): void {
    this.ctx.fillStyle = 'brown';
    this.ctx.beginPath();
    this.ctx.arc(this.xPos, this.yPos, 20, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  update(secondsPassed: number): void {
    this.yPos += this.dy * secondsPassed;
  }
}
