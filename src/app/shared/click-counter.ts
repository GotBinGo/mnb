const timeTreshold = 1000; // ms

export class NthClick {
  N = 5;
  count = 0;
  lastDate = +new Date();

  constructor(clickCount?: number) {
    this.N = clickCount;
  }

  click(): boolean {
    const now = +new Date();
    now - this.lastDate < timeTreshold ? this.count++ : (this.count = 1);
    this.lastDate = now;
    if (this.count >= this.N) {
      this.count = 0;
      return true;
    }
    return false;
  }
}
