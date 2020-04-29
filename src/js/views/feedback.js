import { elements } from './base';

export const winUI = (playing) => {
    if (playing) {
        elements.feedback.textContent = "Spell!";
    } else {
        elements.feedback.textContent = "You win!";
    };
};

let globalStart = 0;
let globalClock = 0;
let globalID;

export const displayTimer = (playing) => {
    timer(playing);
};

const timer = (playing) => {
    if (playing) {
      start();
    } else {
      console.log('stop timer')
      stop(globalID);
    }
    
}

const start = () => {
    let interval;
    if (!interval) {
      globalStart = Date.now();
      //console.log(globalTime);
      globalID = setInterval(update, 100);
    }
};

const delta = () => {
    let now, d;

    now = Date.now();
    //console.log(now);
    d = now - globalStart;
    //console.log(d);
    return d;
};

const update = () => {
  globalClock += delta();
    //console.log(globalClock);
    renderTimer();
};

const renderTimer = () => {
    elements.timer.textContent = (globalClock/100000).toFixed(2).toLocaleString();
};

const stop = (id) => {
  console.log('called stop');
  clearInterval(id);
};

/*
function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render();
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    timer.innerHTML = clock/1000; 
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }
  */