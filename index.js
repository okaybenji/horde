const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 256;
ctx.canvas.height = 224;

const arena = new Image();
arena.src = './assets/images/arena.png';

const createEntity = (options) => {
  const x = options.x || 0;
  const y = options.y || 0;
  const img = new Image();
  img.src = options.img;

  return { x, y, img };
};

const moveEntityBy = (options) => {
  const x = options.entity.x + (options.x || 0);
  const y = options.entity.y + (options.y || 0);
  const newEntity = Object.assign({}, options.entity, {x, y});

  console.log('new player:', newEntity);
  return newEntity;
};

const createPlayer = (options) => {
  const entity = createEntity({
    x: options.x,
    y: options.y,
    img: './assets/images/player/walk/s.png'
  });

  // this isn't going to work because the player it returns
  // won't have a moveBy method!
  const player = Object.assign({}, entity, {
    moveBy({x, y}) {
      return moveEntityBy({ entity, x, y });
    }
  });

  return player;
};

let player = createPlayer({x: 20, y: 20});

const loop = () => {
  // clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw bg
  ctx.drawImage(arena, -80, -156);

  // draw player
  ctx.drawImage(player.img, player.x, player.y);

  // loop
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);