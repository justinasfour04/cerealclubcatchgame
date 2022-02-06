import ImageCache, { CacheKey } from './imageCache';

export default class CerealBowl {
  #xPos: number;

  #yPos: number;

  #image: ImageBitmap | null;

  #hitbox: [number, number, number, number];

  constructor(private ctx: CanvasRenderingContext2D, xPos: number) {
    this.#xPos = xPos;
    this.#yPos = (ctx as CanvasRenderingContext2D).canvas.height;
    this.#image = null;
    this.#hitbox = [80, 155, 420, 345]; // [leftX, topY, rightX, bottomY]

    const { canvas } = ctx;
    window.addEventListener('mousemove', (event) => {
      event.preventDefault();
      const canvasLeftX = canvas.getBoundingClientRect().left;
      this.#xPos = event.clientX - canvasLeftX - (this.#image as ImageBitmap).width / 2;
      this.#yPos = canvas.height - (this.#image as ImageBitmap).height;
    });

    window.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const canvasLeftX = canvas.getBoundingClientRect().left;
      this.#xPos = event.touches[0].clientX - canvasLeftX - (this.#image as ImageBitmap).width / 2;
    }, {
      passive: false,
    });
  }

  draw() {
    if (this.#image === null) {
      this.#image = ImageCache.getImage(CacheKey.CEREAL) as ImageBitmap;
    }

    this.ctx.drawImage(this.#image as ImageBitmap, this.#xPos, this.#yPos);

    const scaleFactor = this.#image.width / 500;
    const [left, top, right, bottom] = this.#hitbox.map((v) => v * scaleFactor);
    const xLeft = this.#xPos + left;
    const xRight = this.#xPos + right;
    const width = xRight - xLeft;

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(this.#xPos + left, this.#yPos + top, width, bottom);
  }
}
