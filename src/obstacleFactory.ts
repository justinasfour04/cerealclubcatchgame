import { FallingBomb } from './fallingBomb';
import { FallingGarbageBag } from './fallingGarbageBag';
import { FallingObject } from './fallingObject';
import { MaxHeap } from './maxHeap';
import { randomNumber } from './util';

const OBSTACLE_SPACING = 150;

export class ObjectFactory {
  latestObject: FallingObject;

  dyGarbageBagModifier: number;

  dyBombModifier: number;

  objects: MaxHeap<FallingObject>;

  constructor(private ctx: CanvasRenderingContext2D, score: number) {
    this.dyGarbageBagModifier = 0;
    this.dyBombModifier = 0;
    this.latestObject = this.initObject(score);
    this.objects = new MaxHeap(this.latestObject);
  }

  reset(score: number) {
    this.latestObject = this.initObject(score);
    this.objects = new MaxHeap(this.latestObject);
  }

  create(score: number) {
    if (this.latestObject.y >= OBSTACLE_SPACING) {
      this.latestObject = this.initObject(score);
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

  deleteObjectOffScreen() {
    if (this.objects.max > this.ctx.canvas.height) {
      this.objects.delete(0);
    }
  }

  private initObject(score: number): FallingObject {
    const left = 0;
    const right = this.ctx.canvas.width;
    const randomX = randomNumber(left, right);
    if (score % 25 === 0) {
      this.dyGarbageBagModifier += randomNumber(10, 100);
      this.dyBombModifier += randomNumber(10, 50);
    }
    const randomDy = randomNumber(400, 700);
    const randomBombDy = randomNumber(300, 500);
    const randomCharacter = randomNumber(0, 500);
    return randomCharacter % 2 === 0
      ? new FallingBomb(this.ctx, randomX, randomBombDy + this.dyBombModifier)
      : new FallingGarbageBag(this.ctx, randomX, randomDy + this.dyGarbageBagModifier);
  }
}
