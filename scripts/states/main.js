const main = {
  preload() {
    var utils = require('../utils');

    utils.resize(game);
    window.onresize = utils.debounce(() => {
      utils.resize(game)
    }, 100);

    // TODO: setting bounds keeps bg from appearing..?
    //game.world.setBounds(0, -game.width, game.width, game.height);

    // prevent game pausing when it loses focus
    game.stage.disableVisibilityChange = true;

    // assets used in loading screen
    // game.load.spritesheet('loading', 'images/sprites/ui-loading.gif', 11, 6);
  },
  create() {
    game.state.add('loading', require('./loading')(game));
    game.state.start('loading');
  }
};

const isTransparent = false;
const shouldAntialias = false;

const game = new Phaser.Game(320, 180, Phaser.AUTO, 'game', {
  preload: main.preload,
  create: main.create
}, isTransparent, shouldAntialias); // disable anti-aliasing

game.state.add('main', main);
game.state.start('main');
