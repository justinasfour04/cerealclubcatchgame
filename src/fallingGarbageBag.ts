import FallingObject from './fallingObject';
import ImageCache, { CacheKey } from './imageCache';

export default class FallingGarbageBag extends FallingObject {
  constructor(ctx: CanvasRenderingContext2D, xPos: number, dy: number) {
    super(ctx, xPos, dy, ImageCache.getImage(CacheKey.GARBAGE_BAG));
  }
}
