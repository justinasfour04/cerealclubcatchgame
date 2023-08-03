import { FallingObject } from './fallingObject';
import { ImageCache, CacheKey } from './imageCache';
import { HitBox } from './types';

export class FallingGarbageBag extends FallingObject {
  constructor(ctx: CanvasRenderingContext2D, xPos: number, dy: number) {
    super(ctx, xPos, dy, ImageCache.getImage(CacheKey.GARBAGE_BAG));
  }

  get hitbox(): HitBox {
    let height = 0;
    let width = 0;
    if (this.image) {
      ({ height, width } = this.image);
    }
    return {
      x1: this.xPos + width / 6,
      y1: this.yPos + height / 1.2,
      x2: this.xPos + width - width / 6,
      y2: this.yPos + height - 5,
    };
  }
}
