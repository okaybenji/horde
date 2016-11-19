const Play = (game) => {
  let bats = [], rats = [], player;

  const spritesheets = require('../../data/spritesheets');

  // TODO: search fs to build this object automatically
  const factories = {
    entities: {
      player: require('../factories/entities/player'),
      enemies: {
        bat: require('../factories/entities/enemies/bat'),
        rat: require('../factories/entities/enemies/rat')
      }
    },
    keys: require('../factories/keys')
  };

  const bounds = {x: 0, y: 0, width: game.width, height: game.height};

  const play = {
    create() {
      game.add.sprite(-48, -146, 'arena');

      player = factories.entities.player({
        sprite: game.add.sprite(152, 82),
        keys: factories.keys(game),
        gamepad: game.input.gamepad.pad1,
        bounds
      });

      [{}, {x: 320}, {y: 180}, {x: 320, y: 180}]
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: bats, bounds}))
        .map(cfg => factories.entities.enemies.bat(cfg))
        .forEach(bat => bats.push(bat));

      [{}, {x: 320}, {y: 180}, {x: 320, y: 180}]
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: rats, bounds}))
        .map(cfg => factories.entities.enemies.rat(cfg))
        .forEach(rat => rats.push(rat));
    },

    update() {

    }
  };
  
  return play;
};

module.exports = Play;
