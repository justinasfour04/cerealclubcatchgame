import GarbageCan from '../static/img/garbage-can.png';
import Bomb from '../static/img/bomb.png';
import Heart from '../static/img/heart.png';
import GarbageBag from '../static/img/garbage-bag.png';
import { loadImage } from './util';

type CacheValue = ImageBitmap;

export enum CacheKey {
  GARBAGE_CAN,
  HEART,
  BOMB,
  GARBAGE_BAG,
}

const cache: Map<CacheKey, CacheValue> = new Map();

export default class ImageCache {
  static async loadAllImages(canvas: HTMLCanvasElement) {
    cache.set(CacheKey.GARBAGE_CAN, await loadImage(
      GarbageCan,
      0,
      0,
      500,
      500,
      {
        resizeWidth: canvas.width / 4,
        resizeQuality: 'medium',
      },
    ));
    cache.set(CacheKey.HEART, await loadImage(
      Heart,
      0,
      0,
      293,
      302,
      {
        resizeWidth: canvas.width / 16,
        resizeQuality: 'medium',
      },
    ));
    cache.set(CacheKey.BOMB, await loadImage(
      Bomb,
      0,
      0,
      258,
      268,
      {
        resizeWidth: canvas.width / 15,
        resizeQuality: 'medium',
      },
    ));
    cache.set(CacheKey.GARBAGE_BAG, await loadImage(
      GarbageBag,
      0,
      0,
      290,
      216,
      {
        resizeWidth: canvas.width / 15,
        resizeQuality: 'medium',
      },
    ));
  }

  static getImage(key: CacheKey) {
    return cache.get(key);
  }
}
