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
      // game.load.spritesheet('blueScarf', 'images/sprites/bit-scarf-blue.gif', 5, 2);

      const spritesheets = [
        // TODO: access the filesystem to build this array automatically
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
        'enemies/bat_fly_w-10.png',
        'enemies/bat_fly_e-10.png'
      ].map((asset, i) => {
        const slash = asset.indexOf('/');
        const dash = asset.indexOf('-');
        const dot = asset.indexOf('.');

        return {
          entity: asset.slice(0, slash),
          name: asset.slice(slash + 1, dash),
          frameCount: Number(asset.slice(dash + 1, dot)),
          // TODO: apparently watchify doesn't like (()=>())
          image: (function() {
            const image = new Image();
            image.src = '../../assets/images/' + asset;
            return image;
          }())
        };
      });

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
