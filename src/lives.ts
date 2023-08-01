import { ImageCache, CacheKey } from './imageCache';

export class Lives {
  constructor(private ctx: CanvasRenderingContext2D) { }

  draw(lives: number) {
    const heart = ImageCache.getImage(CacheKey.HEART);
    if (heart) {
      for (let i = 1; i <= lives; i += 1) {
        this.ctx.drawImage(
          heart,
          (this.ctx.canvas.width - 5 * heart.width) + heart.width * 1.1 * i,
          20,
        );
      }
    }
  }
}
