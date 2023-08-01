import { FallingObject } from './fallingObject';
import { ImageCache, CacheKey } from './imageCache';

export class FallingBomb extends FallingObject {
  constructor(ctx: CanvasRenderingContext2D, xPos: number, dy: number) {
    super(ctx, xPos, dy, ImageCache.getImage(CacheKey.BOMB));
  }

  get hitbox(): number[] {
    const width = this.w;
    const x = this.xPos;
    const y = this.yPos + this.w;
    const height = 10;
    return [x, y, width, height];
  }
}
