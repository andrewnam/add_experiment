export function timer(duration: number,
                      period: number,
                      callback: () => void) {
  let start = Date.now();
  let last_timestamp = start;
  let target_period = period;

  function instance()
  {
    let timestamp = Date.now();
    // If < period/2 before duration is over, then having an
    // extra tick will be even further away from target
    if(timestamp - start >= duration - (target_period / 2)) {
      callback();
    } else {
      let speed = target_period / (timestamp - last_timestamp);
      target_period = period * speed;
      window.setTimeout(instance, target_period);
    }
  }

  window.setTimeout(instance, target_period);
}