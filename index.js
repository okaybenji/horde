const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 256;
ctx.canvas.height = 224;

const arena = new Image();
arena.src = './assets/images/arena.png';

const createEntity = ({x = 0, y = 0, src }) => {
  const img = new Image();
  img.src = src;

  return { x, y, img };
};

const moveEntityBy = ({ entity, x = 0, y = 0 }) => {
  const newEntity = Object.assign({}, entity, {
    x: entity.x + x,
    y: entity.y + y
  });

  return newEntity;
};

let player = createEntity({
  x: 20,
  y: 20,
  src: './assets/images/player/walk/s.png'
});

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