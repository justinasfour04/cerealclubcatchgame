import { FallingObject } from './fallingObject';
import { ImageCache, CacheKey } from './imageCache';

export class FallingGarbageBag extends FallingObject {
  constructor(ctx: CanvasRenderingContext2D, xPos: number, dy: number) {
    super(ctx, xPos, dy, ImageCache.getImage(CacheKey.GARBAGE_BAG));
  }

  get hitbox(): number[] {
    const width = this.w / 3;
    const x = this.xPos + width;
    const y = this.yPos + this.w;
    const height = 5;
    return [x, y, width, height];
  }
}
