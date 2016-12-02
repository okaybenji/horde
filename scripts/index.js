let main = {
  preload() {},
  create() {}
};

const isTransparent = false;
const shouldAntialias = false;
const game = new Phaser.Game(320, 180, Phaser.AUTO, 'game', {
  preload: main.preload,
  create: main.create
}, isTransparent, shouldAntialias); // disable anti-aliasing

main = require('./states/main')(game);
game.state.add('main', main);
game.state.start('main');
