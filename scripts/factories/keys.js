const keysFactory = (game, controls = {}) => {
  const defaultControls = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    shield: 'SPACEBAR',
    attack: 'SHIFT'
  };

  const ctrls = Object.assign({}, defaultControls, controls);

  const keys = {
    up: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.up]),
    down: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.down]),
    left: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.left]),
    right: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.right]),
    shield: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.shield]),
    attack: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.attack]),
  };

  return keys;
};

module.exports = keysFactory;
