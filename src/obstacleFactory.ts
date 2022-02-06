import FallingBomb from './fallingBomb';
import FallingObject from './fallingObject';
import MaxHeap from './maxHeap';
import { randomNumber } from './util';

const OBSTACLE_SPACING = 200;

export default class ObjectFactory {
  latestObject: FallingObject;

  objects: MaxHeap<FallingObject>;

  constructor(private ctx: CanvasRenderingContext2D) {
    const left = 0;
    const right = this.ctx.canvas.width;
    const randomX = randomNumber(left, right);
    const randomDy = randomNumber(50, 150);
    const object = new FallingBomb(this.ctx, randomX, randomDy);
    this.latestObject = object;
    this.objects = new MaxHeap(object);
  }

  reset() {
    const left = 0;
    const right = this.ctx.canvas.width;
    const randomX = randomNumber(left, right);
    const randomDy = randomNumber(50, 150);
    this.latestObject = new FallingBomb(this.ctx, randomX, randomDy);
  }

  create() {
    if (this.latestObject.y >= OBSTACLE_SPACING) {
      const left = 0;
      const right = this.ctx.canvas.width;
      const randomX = randomNumber(left, right);
      const randomDy = randomNumber(50, 150);
      const object = new FallingBomb(this.ctx, randomX, randomDy);
      this.latestObject = object;
      this.objects.insert(object);
    }
  }

  draw() {
    this.objects.items.forEach((object) => {
      object.draw();
    });
  }

  update(secondsPassed: number = 1) {
    this.objects.items.forEach((object) => {
      object.update(secondsPassed);
    });
  }

  deleteOldestObstacles() {
    if (this.objects.max > this.ctx.canvas.height) {
      this.objects.delete();
    }
  }
}
