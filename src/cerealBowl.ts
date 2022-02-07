import FallingBomb from './fallingBomb';
import FallingCereal from './fallingCereal';
import GameState from './gameState';
import ImageCache, { CacheKey } from './imageCache';
import ObjectFactory from './obstacleFactory';

const NUM_LIVES = 3;

export type CollisionType = 'bomb' | 'cereal' | 'none';

export default class CerealBowl {
  #xPos: number;

  #yPos: number;

  #image: ImageBitmap | null;

  #hitbox: [number, number, number, number];

  #lives: number;

  constructor(private ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;
    const canvasLeftX = canvas.getBoundingClientRect().left;

    this.#image = ImageCache.getImage(CacheKey.CEREAL) as ImageBitmap;
    this.#xPos = canvas.width / 2 - this.#image.width / 2;
    this.#yPos = canvas.height - this.#image.height;
    this.#hitbox = [80, 155, 420, 345]; // [leftX, topY, rightX, bottomY]
    this.#lives = NUM_LIVES;

    window.addEventListener('mousemove', (event) => {
      event.preventDefault();
      this.#xPos = event.clientX - canvasLeftX - (this.#image as ImageBitmap).width / 2;
    });

    window.addEventListener('touchmove', (event) => {
      this.#xPos = event.touches[0].pageX - canvasLeftX - (this.#image as ImageBitmap).width / 2;
      event.preventDefault();
    }, {
      passive: false,
    });
  }

  get lives() {
    return this.#lives;
  }

  reset() {
    this.#lives = NUM_LIVES;
  }

  draw() {
    this.ctx.drawImage(this.#image as ImageBitmap, this.#xPos, this.#yPos);

    // const scaleFactor = this.#image.width / 500;
    // const [left, top, right, bottom] = this.#hitbox.map((v) => v * scaleFactor);
    // const xLeft = this.#xPos + left;
    // const xRight = this.#xPos + right;
    // const width = xRight - xLeft;

    // this.ctx.strokeStyle = 'black';
    // this.ctx.strokeRect(this.#xPos + left, this.#yPos + top, width, bottom);
  }

  checkCollision(objectFactory: ObjectFactory, gameState: GameState): CollisionType {
    const { objects } = objectFactory;
    if (this.#image !== null) {
      const scaleFactor = this.#image.width / 500;
      const [left, top, right] = this.#hitbox.map((v) => v * scaleFactor);
      const xLeft = this.#xPos + left;
      const xRight = this.#xPos + right;
      const yTop = this.#yPos + top;

      for (let i = 0; i < objects.size - 1; i += 1) {
        const item = objects.items[i];
        const [xObject, yObject, wObject, hObject] = item.hitbox;
        if (
          xObject + wObject >= xLeft
          && xObject <= xRight
          && yObject + hObject >= yTop
          && yObject <= yTop
        ) {
          if (item instanceof FallingBomb) {
            this.#lives -= 1;
            return 'bomb';
          }

          if (item instanceof FallingCereal) {
            gameState.score += 1;
            objects.delete(i);
            return 'cereal';
          }
        }
      }
    }
    return 'none';
  }

  isDead() {
    if (this.#lives === 0) {
      return true;
    }
    return false;
  }
}
