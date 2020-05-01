import { elements } from '../views/base';


export class Stopwatch {
  constructor () {
    this.offset = Date.now();
    this.delay = 100;
  }

  start() {
    const loop = () => {
      this.d = Date.now() - this.offset;
      elements.timer.textContent = `${(this.d / 1000).toFixed(1)} seconds`;
    };

    if (!this.interval) {
      this.interval = setInterval(loop, this.delay);
    };
  };

  stop() {
    clearInterval(this.interval);
    this.delay = null;
  };

}