import { FallingBomb } from './fallingBomb';
import { FallingGarbageBag } from './fallingGarbageBag';
import { GameState } from './gameState';
import { ImageCache, CacheKey, BackgroundKey } from './imageCache';
import { ObjectFactory } from './obstacleFactory';

const NUM_LIVES = 3;
const BACKGROUND_SWITCH = 10;

export type CollisionType = 'bomb' | 'garbageBag' | 'none';

export class GarbageCan {
  #xPos: number;

  #yPos: number;

  #image: ImageBitmap | null;

  #hitbox: [number, number, number, number];

  #lives: number;

  constructor(private ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;

    this.#image = ImageCache.getImage(CacheKey.GARBAGE_CAN) as ImageBitmap;
    this.#xPos = canvas.width / 2 - this.#image.width / 2;
    this.#yPos = canvas.height - this.#image.height;
    this.#hitbox = [50, 18, this.#image.width - 50, 5]; // [leftX, topY, rightX, bottomY]
    this.#lives = NUM_LIVES;

    window.addEventListener('mousemove', (event) => {
      if (this.#image) {
        this.#xPos = event.pageX - canvas.offsetLeft - this.#image.width / 2;
        if (this.#xPos < 0) {
          this.#xPos = -this.#hitbox[0];
        } else if (this.#xPos + this.#image.width > canvas.width) {
          this.#xPos = canvas.width - this.#image.width + this.#hitbox[0];
        }
      }
      event.preventDefault();
    });

    window.addEventListener('touchmove', (event) => {
      if (this.#image) {
        this.#xPos = event.touches[0].pageX - canvas.offsetLeft - this.#image.width / 2;
      }
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
    // this.drawCollisionBox();
  }

  drawCollisionBox() {
    const [left, top, right, bottom] = this.#hitbox;
    const xLeft = this.#xPos + left;
    const xRight = this.#xPos + right;
    const width = xRight - xLeft;

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(this.#xPos + left, this.#yPos + top, width, bottom);
  }

  checkCollision(objectFactory: ObjectFactory, gameState: GameState): CollisionType {
    const { objects } = objectFactory;
    if (this.#image !== null) {
      const [left, top, right] = this.#hitbox;
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

          if (item instanceof FallingGarbageBag) {
            gameState.score += 1;
            if (gameState.score % BACKGROUND_SWITCH === 0) {
              gameState.backgroundKey = gameState.backgroundKey === BackgroundKey.ONE
                ? BackgroundKey.TWO
                : BackgroundKey.ONE;
            }
            objects.delete(i);
            return 'garbageBag';
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
