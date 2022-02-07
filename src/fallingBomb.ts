import FallingObject from './fallingObject';
import ImageCache, { CacheKey } from './imageCache';

export default class FallingBomb extends FallingObject {
  constructor(ctx: CanvasRenderingContext2D, xPos: number, dy: number) {
    super(ctx, xPos, dy, ImageCache.getImage(CacheKey.BOMB));
  }
}
