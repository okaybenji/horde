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
      game.load.tilemap('dungeon', '../../assets/dungeon.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('dungeon', '../../assets/images/dungeon.png');

      spritesheets.forEach(({ name, image, frameCount }) => {
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
