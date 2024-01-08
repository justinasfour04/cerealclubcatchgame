import { Howl } from 'howler';

import { FallingBomb } from './fallingBomb';
import { FallingGarbageBag } from './fallingGarbageBag';
import { GameState } from './gameState';
import { ImageCache, CacheKey, BackgroundKey } from './imageCache';
import { ObjectFactory } from './obstacleFactory';
import { HitBox } from './types';
import splat1 from '../static/sound/splat1.wav';
import splat2 from '../static/sound/splat2.wav';
import splat3 from '../static/sound/splat3.wav';
import bombHit from '../static/sound/bombHit.wav';
import { randomNumber } from './util';
// import { drawCollisionBox } from './util';

const NUM_LIVES = 3;
const BACKGROUND_SWITCH = 10;

export type CollisionType = 'bomb' | 'garbageBag' | 'none';

export class GarbageCan {
  #xPos: number;

  #yPos: number;

  #image: ImageBitmap | null;

  #lives: number;

  #sounds: {
    splat: Howl[],
    bombHit: Howl,
  };

  constructor(private ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;

    this.#image = ImageCache.getImage(CacheKey.GARBAGE_CAN) as ImageBitmap;
    this.#xPos = canvas.width / 2 - this.#image.width / 2;
    this.#yPos = canvas.height - this.#image.height;
    this.#lives = NUM_LIVES;
    this.#sounds = {
      splat: [
        new Howl({ src: [splat1] }),
        new Howl({ src: [splat2] }),
        new Howl({ src: [splat3] }),
      ],
      bombHit: new Howl({ src: [bombHit] }),
    };

    window.addEventListener('mousemove', (event) => {
      if (this.#image) {
        this.#xPos = event.pageX - this.#image.width / 2;
      }
      event.preventDefault();
    });

    window.addEventListener('touchmove', (event) => {
      if (this.#image) {
        this.#xPos = event.touches[0].pageX - this.#image.width / 2;
      }
      event.preventDefault();
    }, {
      passive: false,
    });
  }

  get hitbox(): HitBox {
    let width = 0;
    if (this.#image) {
      ({ width } = this.#image);
    }
    return {
      x1: this.#xPos + width / 6,
      y1: this.#yPos + 10,
      x2: this.#xPos + width - width / 6,
      y2: this.#yPos + 20,
    };
  }

  get lives() {
    return this.#lives;
  }

  reset() {
    this.#lives = NUM_LIVES;
  }

  draw() {
    this.ctx.drawImage(this.#image as ImageBitmap, this.#xPos, this.#yPos);
    // drawCollisionBox(this.ctx, this.hitbox);
  }

  checkCollision(objectFactory: ObjectFactory, gameState: GameState): CollisionType {
    const { objects } = objectFactory;
    if (this.#image !== null) {
      for (let i = 0; i < objects.size - 1; i += 1) {
        const item = objects.items[i];
        if (
          item.hitbox.x2 >= this.hitbox.x1
          && item.hitbox.x1 <= this.hitbox.x2
          && item.hitbox.y2 >= this.hitbox.y1
          && item.hitbox.y1 <= this.hitbox.y2
        ) {
          if (item instanceof FallingBomb) {
            this.#sounds.bombHit.play();
            this.#lives -= 1;
            return 'bomb';
          }

          if (item instanceof FallingGarbageBag) {
            const randomSplat = randomNumber(0, 2);
            this.#sounds.splat[randomSplat].play();
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
