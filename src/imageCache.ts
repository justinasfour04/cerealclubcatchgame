import GarbageCan from '../static/img/garbage-can.png';
import Bomb from '../static/img/bomb.png';
import Heart from '../static/img/heart.png';
import GarbageBag from '../static/img/garbage-bag.png';
import Background1 from '../static/img/background1.png';
import Background2 from '../static/img/background2.png';
import { loadImage } from './util';

type CacheValue = ImageBitmap;

export enum CacheKey {
  GARBAGE_CAN,
  HEART,
  BOMB,
  GARBAGE_BAG,
  BACKGROUND_1,
}

export enum BackgroundKey {
  ONE,
  TWO,
}

const cache: Map<CacheKey, CacheValue> = new Map();
const backgrounds: Map<BackgroundKey, ImageBitmap> = new Map();

export class ImageCache {
  static async loadAllImages(canvas: HTMLCanvasElement) {
    cache.set(CacheKey.GARBAGE_CAN, await loadImage(
      GarbageCan,
      0,
      0,
      500,
      324,
      {
        resizeWidth: canvas.width / 3,
        resizeQuality: 'high',
      },
    ));
    cache.set(CacheKey.HEART, await loadImage(
      Heart,
      0,
      0,
      243,
      225,
      {
        resizeWidth: canvas.width / 12,
        resizeQuality: 'high',
      },
    ));
    cache.set(CacheKey.BOMB, await loadImage(
      Bomb,
      0,
      0,
      210,
      251,
      {
        resizeWidth: canvas.width / 8,
        resizeQuality: 'high',
      },
    ));
    cache.set(CacheKey.GARBAGE_BAG, await loadImage(
      GarbageBag,
      0,
      0,
      251,
      251,
      {
        resizeWidth: canvas.width / 5,
        resizeQuality: 'high',
      },
    ));

    backgrounds.set(
      BackgroundKey.ONE,
      await loadImage(
        Background1,
        0,
        0,
        897,
        941,
        {
          resizeWidth: canvas.width,
          resizeHeight: canvas.height,
        },
      ),
    );
    backgrounds.set(
      BackgroundKey.TWO,
      await loadImage(
        Background2,
        0,
        0,
        897,
        941,
        {
          resizeWidth: canvas.width,
          resizeHeight: canvas.height,
        },
      ),
    );
  }

  static getImage(key: CacheKey) {
    return cache.get(key);
  }

  static getBackground(key: BackgroundKey): ImageBitmap {
    return backgrounds.get(key) as ImageBitmap;
  }
}
