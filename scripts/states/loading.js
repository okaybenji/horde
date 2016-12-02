const spritesheets = require('../../data/spritesheets');

const Loading = (game) => {
  const loading = {
    init() {
      // const loading = game.add.sprite(26, 29, 'loading');
      // loading.animations.add('loading');
      // loading.animations.play('loading');

      // document.getElementById('loading').style.display = 'none';
    },

    preload() {
      // TODO: load all images automatically
      game.load.image('arena', '../../assets/images/arena.png');

      spritesheets.forEach(({ name, image, frameCount }) => {
        const path = image.src;
        const width = image.width / frameCount;
        const height = image.height;
        game.load.spritesheet(name, path, width, height);
      });

      // automatically generate west- and north-facing sprites by flipping these
      // TODO: will need to reverse frame order after flipping (or just flip each frame to begin with)
      spritesheets.map((spritesheet) => {
        const image = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = spritesheet.image.width;
        canvas.height = spritesheet.image.height;
        ctx.drawImage(spritesheet.image, 0, 0);
        // const data = context.getImageData(0, 0, image.width, image.height);

        let direction;
        if (spritesheet.direction === 'e') {
          direction = 'w';
           ctx.scale(-1, 1);
        } else {
          direction = 'n';
           ctx.scale(1, -1);
        }

        const src = canvas.toDataURL("image/png");
        image.src = src;
        const name = spritesheet.name.slice(0, spritesheet.name.length - 1) + direction;

        document.body.appendChild(canvas);

        return Object.assign({}, spritesheet, {direction, name, image, src});
      }).forEach(({ name, image, frameCount }) => {
        const path = image.src;
        const width = image.width / frameCount;
        const height = image.height;
        game.load.spritesheet(name, path, width, height);
      });
    },
    create() {
      game.input.gamepad.start();

      game.state.add('splash', require('./splash')(game));
      game.state.add('play', require('./play')(game));
      game.state.start('splash');
    }
  };
  
  return loading;
};

module.exports = Loading;
