// import Timeout from 'smart-timeout';
const Timeout = require('smart-timeout');

export function timer(duration: number,
                      period: number,
                      callback: () => void) {
  let start = Date.now();
  let last_timestamp = start;
  let target_period = period;

  function tick()
  {
    let timestamp = Date.now();
    // If < period/2 before duration is over, then having an
    // extra tick will be even further away from target
    if(timestamp - start >= duration - (target_period / 2)) {
      callback();
    } else {
      let speed = target_period / (timestamp - last_timestamp);
      target_period = period * speed;
      Timeout.set(timestamp, tick, target_period);
    }
  }

  Timeout.set(start, tick, target_period);
}

export function round(n: number, decimals: number) {
  // @ts-ignore
  return +(Math.round(n + `e+${decimals}`)  + `e-${decimals}`);
}

export function toUSD(n: number) {
  n = round(n, 5);
  let s = n.toString().split('.');
  let precision = 2;
  if (s.length > 1) {
    precision = Math.max(2, s[1].length);
  }
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision
  });
  return usdFormatter.format(n);
}

/*
Generates a random integer between [a, b] inclusive if b is provided.
If b is not provided, generates a random integer between [0, a] inclusive.
 */
export function randInt(a: number, b?: number) {
  if (b != undefined) {
    return a + Math.floor(Math.random() * (b - a + 1));
  } else {
    return Math.floor(Math.random() * (a + 1));
  }
}
