import Cereal from '../static/img/cereal.png';
import Bomb from '../static/img/bomb.png';
import Heart from '../static/img/heart.png';
import Flake from '../static/img/flake.png';
import { loadImage } from './util';

type CacheValue = ImageBitmap;

export enum CacheKey {
  CEREAL,
  HEART,
  BOMB,
  FLAKE,
}

const cache: Map<CacheKey, CacheValue> = new Map();

export default class ImageCache {
  static async loadAllImages(canvas: HTMLCanvasElement) {
    cache.set(CacheKey.CEREAL, await loadImage(
      Cereal,
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
    cache.set(CacheKey.FLAKE, await loadImage(
      Flake,
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
