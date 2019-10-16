import Timeout = NodeJS.Timeout;

class Timer {
  target: number;
  period: number;
  callback: () => void;
  startTimestamp: number;
  interval: Timeout;

  constructor(target: number, period: number, callback: () => void) {
    this.target = target;
    this.period = period;
    this.callback = callback;
  }

  start() {
    this.startTimestamp = Date.now();
    this.interval = setInterval(this.tick.bind(this), this.period);
  }

  tick() {
    if (Date.now() - this.startTimestamp >= this.period) {
      clearInterval(this.interval);
      this.callback();
    }
  }
}

export default Timer;