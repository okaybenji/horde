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
    height: 16
  }
});

const createAnimation = (image, cellWidth) => {
  // assumes image contains single row of equally-spaced cells
  if (image.width % cellWidth !== 0) {
    console.warn('image width not evenly divisible by cell width');
  }
  const frameCount = image.width / cellWidth;
  const frames = createArray(frameCount);
  return frames.map(function(frame, i) {
    return {
      x: i * cellWidth,
      y: 0,
      width: cellWidth,
      height: image.height
    };
  });
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

  // draw player
  ctx.drawImage(player.img, player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, player.x, player.y, player.sprite.width, player.sprite.height);

  // loop
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
