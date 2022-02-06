import FallingObject from './fallingObject';
import ImageCache, { CacheKey } from './imageCache';

export default class FallingBomb extends FallingObject {
  get hitbox(): number[] {
    return [this.xPos, this.yPos, this.xPos + 40, this.yPos + 40];
  }

  draw(): void {
    const bomb = ImageCache.getImage(CacheKey.BOMB) as ImageBitmap;
    this.ctx.drawImage(bomb, this.xPos, this.yPos);
  }

  update(secondsPassed: number): void {
    this.yPos += this.dy * secondsPassed;
  }
}
