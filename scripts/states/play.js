const spritesheets = require('../../data/spritesheets');
let bats = [], player;

// TODO: search fs to build this object automatically
const factories = {
  player: require('../entities/player'),
  enemies: {
    bat: require('../entities/enemies/bat')
  }
};

const Play = (game) => {
  const play = {
    create() {
      game.add.sprite(-48, -146, 'arena');

      player = factories.player(game, {x: 152, y: 82});

      [{}, {x: 320}, {y: 180}, {x: 320, y: 180}]
        .map(cfg => Object.assign({target: player, neighbors: bats}, cfg))
        .map(cfg => factories.enemies.bat(game, cfg))
        .forEach(bat => bats.push(bat));
    },

    update() {

    }
  };
  
  return play;
};

module.exports = Play;
