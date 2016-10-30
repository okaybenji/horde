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

// Number -> Array
const createArray = (length) => Array.apply(null, Array(length));

const resize = () => {
  document.body.style.zoom = window.innerWidth / ctx.canvas.width;
};
resize();
window.onresize = debounce(resize, 100);

// Object -> Entity
const createEntity = ({x = 0, y = 0, animation }) => {
  const sprite = Object.assign({}, animation.frames[0], {
    frame: 0,
    lastUpdated: window.performance.now()
  });
  return { x, y, sprite, animation};
};

const drawEntity = (entity) => {
  ctx.drawImage(entity.animation.image, entity.sprite.x, entity.sprite.y, entity.sprite.width, entity.sprite.height, entity.x, entity.y, entity.sprite.width, entity.sprite.height);
};

// Entity -> Entity
const moveEntityBy = ({ entity, x = 0, y = 0 }) => {
  const newEntity = Object.assign({}, entity, {
    x: entity.x + x,
    y: entity.y + y
  });

  return newEntity;
};

// Object -> Animation
const createAnimation = ({ image, frameCount }) => {
  // assumes image contains single row of equally-spaced cells
  if (image.width % frameCount !== 0) {
    // console.warn('image width not evenly divisible by frame count');
  }
  const cellWidth = image.width / frameCount;
  const frames = createArray(frameCount).map(function(frame, i) {
    return {
      x: i * cellWidth,
      y: 0,
      width: cellWidth,
      height: image.height,
      frame: i
    };
  });

  return {image, frames};
};

// Object -> Sprite
const animateSprite = ({ sprite, animation, fps = 12, now }) => {
  if (sprite.isPaused) {
    return sprite;
  }

  const updateInterval = 1000 / fps;
  const delta = now - sprite.lastUpdated;
  if (delta < updateInterval) {
    return sprite;
  }

  let frame = sprite.frame + 1;
  if (frame > animation.frames.length - 1) {
    frame = 0;
  }

  const newSprite = Object.assign({lastUpdated: now}, animation.frames[frame]);
  return newSprite;
};

// TODO: access the filesystem to build this array automatically
// TODO: automate entity factory creation using this data
const assets = [
  'player/attack_e-3.png',
  'player/attack_n-3.png',
  'player/attack_s-3.png',
  'player/attack_w-3.png',
  'player/roll_e-3.png',
  'player/roll_n-3.png',
  'player/roll_s-3.png',
  'player/roll_w-3.png',
  'player/shield_e-1.png',
  'player/shield_n-1.png',
  'player/shield_s-1.png',
  'player/shield_w-1.png',
  'player/walk_e-2.png',
  'player/walk_n-2.png',
  'player/walk_s-2.png',
  'player/walk_w-2.png',
].map((asset, i) => {
  const slash = asset.indexOf('/');
  const dash = asset.indexOf('-');
  const dot = asset.indexOf('.');

  return {
    entity: asset.slice(0, slash),
    name: asset.slice(slash + 1, dash),
    frameCount: Number(asset.slice(dash + 1, dot)),
    path: './assets/images/' + asset
  };
});

// TODO: is there a better way to do this, mapping an array to an object?
let animations = {};
assets.forEach((asset) => {
  if (!animations[asset.entity]) {
    animations[asset.entity] = {};
  }

  let image = new Image();
  image.src = asset.path;
  animations[asset.entity][asset.name] = createAnimation({image, frameCount: asset.frameCount});
});

// Date -> Entity -> Entity
const animateAtTime = (now) => {
  // Entity -> Entity
  return (entity) => {
    const newEntity = Object.assign({}, entity);
    newEntity.sprite = animateSprite({
      sprite: entity.sprite,
      animation: entity.animation,
      now
    });

    return newEntity;
  };
};

// String -> Entity
const movePlayer = (player, dir) => {
  let newPlayer = Object.assign({}, player);

  // Position -> Entity
  const movePlayerBy = ({x = 0, y = 0}) => {
    return moveEntityBy({entity: newPlayer, x, y});
  };
  // TODO: velocity is currently framerate-dependent!
  const vel = 1;
  const directions = {
    n: () => movePlayerBy({y: -vel}),
    s: () => movePlayerBy({y: vel}),
    e: () => movePlayerBy({x: vel}),
    w: () => movePlayerBy({x: -vel})
  };

  newPlayer = directions[dir](); // move player in direction
  newPlayer.animation = animations.player['walk_' + dir]; // update player animation
  newPlayer.dir = dir;

  return newPlayer;
};

const arena = new Image();
arena.src = './assets/images/arena.png';

let inputs = {
  n: false,
  s: false,
  e: false,
  w: false,
  shield: false
};

let factories = {
  entities: {}
};

factories.entities.player = ({x = 0, y = 0}) => {
  let newPlayer = createEntity({
    x, y, animation: animations.player.walk_s
  });
  newPlayer.dir = 's'; // player starts out facing south
  // newPlayer.animations = animations.player; // <- think about this

  return newPlayer;
};

// Player, Inputs -> Player
const applyInputs = (player, inputs) => {
  let newPlayer = Object.assign({}, player);
  let noInputs = true;

  for (const input in inputs) {
    if (inputs[input]) {
      noInputs = false;
    }
  }

  // if all inputs are off/false, pause player animation
  newPlayer.sprite.isPaused = noInputs;

  if (noInputs) {
    // reset to default animation
    // TODO: consider storing default animation on entity on creation
    newPlayer.animation = animations.player['walk_' + player.dir];
  } else {
    // player cannot perform other actions while shield is up
    if (inputs.shield) {
      newPlayer.animation = animations.player['shield_' + player.dir];
    } else {
      ['n', 's', 'e', 'w']
        .filter((dir) => inputs[dir]) // which inputs are active
        .forEach((dir) => newPlayer = movePlayer(newPlayer, dir));
    }
  }

  return newPlayer;
};

factories.entities.localPlayer = ({x = 0, y = 0, controls}) => {
  let newLocalPlayer = factories.entities.player({x, y});
  newLocalPlayer.applyInputs = applyInputs; // TODO: pass controls to applyInputs and get a new function back?

  return newLocalPlayer;
};

let playerOne = factories.entities.localPlayer({x: 152, y: 82, controls: {}});

// Inputs, Number, Boolean -> Inputs
const updateInputs = (inputs, keyCode, val) => {
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
        return {shield: val};
    }
  };

  return Object.assign({}, inputs, newInput(keyCode));
};

document.addEventListener('keydown', (e) => {
  inputs = updateInputs(inputs, e.keyCode, true);
});

document.addEventListener('keyup', (e) => {
  inputs = updateInputs(inputs, e.keyCode, false);
});

// TODO: update loop to accept state object with arena, player, and inputs.
// set up the state inside a new function passed directly to the first call
// to requestAnimationFrame.
// not sure how inputs/player would work with the event listeners, though...
const loop = () => {
  const now = window.performance.now();

  // clear canvas
  // TODO: look into only redrawing parts of the screen which have changed
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw bg
  ctx.drawImage(arena, -48, -146);

  // update player
  playerOne = applyInputs(playerOne, inputs);
  const animate = animateAtTime(now);
  playerOne = animate(playerOne);
  drawEntity(playerOne);

  // loop
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
