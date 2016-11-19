const spritesheets = require('../../data/spritesheets');
let bats = [], player;

// TODO: search fs to build this object automatically
const factories = {
  entities: {
    player: require('../factories/entities/player'),
    enemies: {
      bat: require('../factories/entities/enemies/bat')
    }
  },
  keys: require('../factories/keys')
};

const Play = (game) => {
  const play = {
    create() {
      game.add.sprite(-48, -146, 'arena');

      player = factories.entities.player({
        sprite: game.add.sprite(152, 82),
        keys: factories.keys(game),
        gamepad: game.input.gamepad.pad1
      });

      [{}, {x: 320}, {y: 180}, {x: 320, y: 180}]
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: bats}))
        .map(cfg => factories.entities.enemies.bat(cfg))
        .forEach(bat => bats.push(bat));
    },

    update() {

    }
  };
  
  return play;
};

module.exports = Play;
