import FallingBomb from './fallingBomb';
import FallingObject from './fallingObject';
import MaxHeap from './maxHeap';
import { randomNumber } from './util';

const OBSTACLE_SPACING = 200;

export default class ObjectFactory {
  latestObject: FallingObject;

  objects: MaxHeap<FallingObject>;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.latestObject = this.initObject();
    this.objects = new MaxHeap(this.latestObject);
  }

  reset() {
    this.latestObject = this.initObject();
    this.objects = new MaxHeap(this.latestObject);
  }

  create() {
    if (this.latestObject.y >= OBSTACLE_SPACING) {
      this.latestObject = this.initObject();
      this.objects.insert(this.latestObject);
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

  private initObject(): FallingObject {
    const left = 0;
    const right = this.ctx.canvas.width;
    const randomX = randomNumber(left, right);
    const randomDy = randomNumber(50, 150);
    return new FallingBomb(this.ctx, randomX, randomDy);
  }
}
