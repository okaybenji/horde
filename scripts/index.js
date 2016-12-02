// create temporary faux main state, since game needs this for instantiation
let main = {
  preload() {},
  create() {}
};

const isTransparent = false;
const shouldAntiAlias = false;
const game = new Phaser.Game(320, 180, Phaser.AUTO, 'game', {
  preload: main.preload,
  create: main.create
}, isTransparent, shouldAntiAlias); // disable anti-aliasing

main = require('./states/main')(game);
game.state.add('main', main);
game.state.start('main');
