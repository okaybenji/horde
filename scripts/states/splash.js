const Splash = (game) => {
  const splash = {
    create() {
      // const title = game.add.sprite(0, 0, 'title');
      // title.animations.add('title');
      // title.animations.play('title', 32/3, true);

      const padNames = ['pad1', 'pad2', 'pad3', 'pad4'];

      const unassignStartButtons = () => {
        padNames.forEach(function(padName) {
          var startButton = game.input.gamepad[padName].getButton(Phaser.Gamepad.XBOX360_START);
            if (startButton) {
              startButton.onDown.forget();
            }
        });
      };

      const startGame = () => {
        unassignStartButtons();

        if (game.state.current === 'splash') {
          game.state.start('play');
        }
      };

      // start game when start/enter is pressed
      const assignStartButtons = () => {
        unassignStartButtons();

        padNames.forEach(function(padName) {
          var startButton = game.input.gamepad[padName].getButton(Phaser.Gamepad.XBOX360_START);
          if (startButton) {
            startButton.onDown.addOnce(startGame);
          }
        });
      };

      game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.addOnce(startGame);
      if (game.input.gamepad.supported) {
        if (game.input.gamepad.active) {
          assignStartButtons();
        }
        game.input.gamepad.onConnectCallback = assignStartButtons;
        game.input.gamepad.onDisconnectCallback = assignStartButtons;
      }

      // for now, bypass splash screen...
      // game.state.start('play'); // TODO: REMOVE ME!
    }
  };

  return splash;
};

module.exports = Splash;
