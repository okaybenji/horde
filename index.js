const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 320;
ctx.canvas.height = 180;

// adapted from underscore
const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

const createArray = (length) => Array.apply(null, Array(length));

const resize = () => {
  document.body.style.zoom = window.innerWidth / ctx.canvas.width;
};
resize();
window.onresize = debounce(resize, 100);

const arena = new Image();
arena.src = './assets/images/arena.png';

// TODO: should i init entities with sprite frame of -1?
const createEntity = ({x = 0, y = 0, sprite }) => {
  const img = new Image();
  img.src = sprite.src;

  return { x, y, sprite, img };
};

const moveEntityBy = ({ entity, x = 0, y = 0 }) => {
  const newEntity = Object.assign({}, entity, {
    x: entity.x + x,
    y: entity.y + y
  });

  return newEntity;
};

let player = createEntity({
  x: 152,
  y: 82,
  sprite: {
    src: './assets/images/player/walk/s.png',
    x: 0,
    y: 0,
    width: 13,
    height: 16,
    frame: 0
  }
});

const createAnimation = ({ image, cellWidth }) => {
  // assumes image contains single row of equally-spaced cells
  if (image.width % cellWidth !== 0) {
    // console.warn('image width not evenly divisible by cell width');
  }
  const frameCount = image.width / cellWidth;
  const frames = createArray(frameCount).map(function(frame, i) {
    return {
      x: i * cellWidth,
      y: 0,
      width: cellWidth,
      height: image.height,
      frame: i
    };
  });
  const animation = {
    frames,
    lastUpdated: window.performance.now()
  };

  return animation;
};

// TODO: ugh, this is really gross, and it shouldn't be.
// the problem is related to trying to functionally track the
// last time the animation frame changed and the fact that
// Object.assign makes a shallow clone of an object.
const animateEntity = ({ entity, animationName, fps = 12, now }) => {
  const animation = entity.animations[animationName];
  const updateInterval = 1000 / fps;
  if (now - animation.lastUpdated < updateInterval) {
    return entity;
  }

  let frame = entity.sprite.frame + 1;
  if (frame > animation.frames.length - 1) {
    frame = 0;
  }

  const sprite = animation.frames[frame];

  let animUpdate = {};
  animUpdate[animationName] = {
    frames: animation.frames
  };
  animUpdate[animationName].lastUpdated = now;
  let animations = Object.assign({}, entity.animations, animUpdate);

  const newEntity = Object.assign({}, entity, {sprite, animations});
  return newEntity;
};

player.move = (dir) => {
  const movePlayer = ({x = 0, y = 0}) => {
    return moveEntityBy({entity: player, x, y});
  };
  const vel = 1;
  const directions = {
    n: () => movePlayer({y: -vel}),
    s: () => movePlayer({y: vel}),
    e: () => movePlayer({x: vel}),
    w: () => movePlayer({x: -vel})
  };

  return directions[dir]();
};

player.animations = {
  walk: createAnimation({ image: player.img, cellWidth: 13 })
};

let input = {
  n: false,
  s: false,
  e: false,
  w: false,
  atk: false
};

function updateInput(keyCode, val) {
  const newInput = function(keyCode) {
    switch (keyCode) {
      // left
      case 65:
      case 37:
        return {w: val};

      // up
      case 87:
      case 38:
        return {n: val};

      // right
      case 68:
      case 39:
        return {e: val};

      // down
      case 83:
      case 40:
        return {s: val};

      // space bar;
      case 32:
        return {atk: val};
    }
  };

  return Object.assign({}, input, newInput(keyCode));
}

document.addEventListener('keydown', (e) => {
  input = updateInput(e.keyCode, true);
});

document.addEventListener('keyup', (e) => {
  input = updateInput(e.keyCode, false);
});

// TODO: update loop to accept state object with arena, player, and input.
// set up the state inside a new function passed directly to the first call
// to requestAnimationFrame.
// not sure how input would work with the event listeners, though...
const loop = () => {
  // clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw bg
  ctx.drawImage(arena, -48, -146);

  // update player
  for (const dir in input) {
    if (input[dir]) {
      player = player.move(dir);
    }
  }

  player = animateEntity({
    entity: player,
    animationName: 'walk',
    now: window.performance.now()
  });

  // draw player
  ctx.drawImage(player.img, player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, player.x, player.y, player.sprite.width, player.sprite.height);

  // loop
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
