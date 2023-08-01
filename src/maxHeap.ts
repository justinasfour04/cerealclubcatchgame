import { FallingObject } from './fallingObject';

export class MaxHeap<T extends FallingObject> {
  private heap: T[] = [];

  constructor(value: T) {
    this.heap.push(value);
  }

  get size() {
    return this.heap.length;
  }

  get items() {
    return this.heap;
  }

  get max() {
    return this.heap[0]?.y ?? 0;
  }

  private parent(position: number) {
    return this.heap[Math.floor(position / 2)];
  }

  private leftChiled(position: number) {
    return this.heap[2 * position];
  }

  private rightChild(position: number) {
    return this.heap[2 * position + 1];
  }

  private isLeaf(position: number) {
    if (Math.floor(position / 2) > this.size - 1 && position < this.size - 1) {
      return true;
    }
    return false;
  }

  insert(value: T) {
    this.heap.push(value);

    let currentIndex = this.size - 1;

    while (this.heap[currentIndex].y > this.parent(currentIndex).y) {
      [
        this.heap[currentIndex],
        this.heap[Math.floor(currentIndex / 2)],
      ] = [
        this.heap[Math.floor(currentIndex / 2)],
        this.heap[currentIndex],
      ];
      currentIndex = Math.floor(currentIndex / 2);
    }
    this.maxHeapify(0);
  }

  delete(position: number) {
    [this.heap[position]] = [this.heap[this.size - 1]];
    this.heap.pop();
    this.maxHeapify(position);
  }

  maxHeapify(position: number) {
    if (!this.isLeaf(position)) {
      if ((this.leftChiled(position) && this.leftChiled(position).y > this.heap[position].y)
        || (this.rightChild(position) && this.rightChild(position).y > this.heap[position].y)) {
        if (this.leftChiled(position).y > (this.rightChild(position)?.y ?? 0)) {
          [
            this.heap[2 * position],
            this.heap[position],
          ] = [
            this.heap[position],
            this.heap[2 * position],
          ];
          this.maxHeapify(2 * position);
        } else {
          [
            this.heap[2 * position + 1],
            this.heap[position],
          ] = [
            this.heap[position],
            this.heap[2 * position + 1],
          ];
          this.maxHeapify(2 * position + 1);
        }
      }
    }
  }
}
