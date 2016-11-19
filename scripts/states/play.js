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
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: bats}))
        .map(cfg => factories.enemies.bat(cfg))
        .forEach(bat => bats.push(bat));
    },

    update() {

    }
  };
  
  return play;
};

module.exports = Play;
