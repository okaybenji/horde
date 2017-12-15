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
      game.load.tilemap('zelda-dungeon', '../../assets/zelda-dungeon.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('zelda-dungeon', '../../assets/images/zelda-dungeon.png');
      game.load.image('heart', '../../assets/images/heart.png');

      spritesheets.forEach(({ name, image, frameCount }) => {
        const path = image.src;
        // TODO: on first load, image.width and image.height each come through as 0
        // specifying the width and height manually would solve this problem...
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
