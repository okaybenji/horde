const Main = (game) => {
  const main = {
    preload() {
      var utils = require('../utils');

      utils.resize(game);
      window.onresize = utils.debounce(() => {
        utils.resize(game);
      }, 100);

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

  return main;
};

module.exports = Main;
