const _ = require('lodash');
const Timeout = require('smart-timeout');

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function timer(duration: number,
                      callback: () => void) {
  let period = 25; // just a default, can change but works fine in practice
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
      Timeout.set(start, tick, target_period);
    }
  }

  Timeout.set(start, tick, target_period);
  return start; // key to kill timer
}

export function clear_timer(key: number) {
  Timeout.clear(key);
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
Takes an object and returns a new object with key-value pairs that satisfy condition
 */
export function where(o: Object, condition: (key: any, value: any) => boolean) {
  const obj = {}
  const keys = _.keys(o);
  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let v = o[k];
    if (condition(k, v)) {
      obj[k] = v;
    }
  }
  return obj;
}

/*
Returns an array with every permutation of items in a and b
 */
export function outer(a: Array<any>, b: Array<any>) {
  return _.flatten(_.map(a, (i: any) => _.map(b, (j: any) => [i, j])));
}

export function hasDuplicates(a: Array<any>) {
  return (new Set(a)).size !== a.length;
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

/*
Shuffles an array such that f(a[i], a[i+1) is always preserved
f must be that commutative: i.e. f(a, b) == f(b, a)
May return a local minimum
Runtime: O(n^2)
 */
export function neighborConsistentShuffle(a: Array<any>, f: (x: any, y: any) => boolean) {
  a = _.shuffle(a);
  for (let i=0; i < a.length - 1; i++) {
    if (!f(a[i], a[i+1])) {
      if (f(a[i+1], a[i])) {
        throw new Error(`f is not commutative: f(${a[i]}, ${a[i+1]}) != f(${a[i+1]}, ${a[i]})`)
      }
      let indices = _.shuffle(_.range(a.length));
      for (let j=0; j < indices.length; j++) {
        let i2 = indices[j];
        let e1 = a[i];
        let e2 = a[i2];
        let consistent1 = (i == 0 || f(a[i-1], e2)) && (i == a.length-1 || f(e2, a[i+1]));
        let consistent2 = (i2 == 0 || f(a[i2-1], e1)) && (i2 == a.length-1 || f(e1, a[i2+1]));
        if (consistent1 && consistent2) {
          a[i] = e2;
          a[i2] = e1;
          break;
        }
      }
    }
  }
  return a;
}

