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

const resizeWidth = (canvas: HTMLCanvasElement, maxWidth: number) => {
  if (canvas.width > 1300) {
    return maxWidth;
  }

  if (window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90) {
    if (canvas.width <= 1300 && canvas.width > 1200) {
      return maxWidth * 0.95;
    }
    if (canvas.width <= 1200 && canvas.width > 1100) {
      return maxWidth * 0.9;
    }
    if (canvas.width <= 1000 && canvas.width > 900) {
      return maxWidth * 0.85;
    }
    return maxWidth * 0.8;
  }

  if (canvas.width <= 1300 && canvas.width > 1200) {
    return maxWidth * 1.2;
  }
  if (canvas.width <= 1200 && canvas.width > 1100) {
    return maxWidth * 1.4;
  }
  if (canvas.width <= 1000 && canvas.width > 900) {
    return maxWidth * 1.5;
  }

  return maxWidth * 1.8;
};

export class ImageCache {
  static async loadAllImages(canvas: HTMLCanvasElement) {
    cache.set(CacheKey.GARBAGE_CAN, await loadImage(
      GarbageCan,
      0,
      0,
      500,
      324,
      {
        resizeWidth: resizeWidth(canvas, 175),
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
        resizeWidth: resizeWidth(canvas, 60),
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
        resizeWidth: resizeWidth(canvas, 75),
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
        resizeWidth: resizeWidth(canvas, 100),
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
