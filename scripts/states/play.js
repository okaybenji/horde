const utils = require('../utils');

const Play = (game) => {
  window.game = game;

  const bats = [];
  const rats = [];
  const enemies = [];
  let player;
  let boundary;
  let entities;
  let cursors;
  let enemyCount = 0;

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

  const play = {
    create() {
      const map = game.add.tilemap('zelda-dungeon');
      map.addTilesetImage('Zelda Dungeon', 'zelda-dungeon');
      boundary = map.createLayer('Bounds');
      map.createLayer('Base');
      map.createLayer('Blocks');
      map.createLayer('Doors');

      map.setCollisionByExclusion([], true, boundary);

      const bounds = {x: 0, y: 0, width: 512, height: 512};
      entities = game.add.group();

      player = factories.entities.player({
        sprite: game.add.sprite(44, 20),
        keys: factories.keys(game),
        gamepad: game.input.gamepad.pad1,
        enemies, //  for now, passing enemies to player to allow killing them... come up with better solution
        game, // adding this back in for now. remove it when you figure out how to do the sword w/o it!
        boundary // for now, passing boundary to player so it can collide (doing this in state update does nothing)
      });
      window.player = player;

      entities.add(player);

      // Add after player to sort over
      map.createLayer('Walls');
      map.createLayer('Doorframes');

      // camera lerp
      game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
      // start camera at player's position (from top left rather than center)
      game.camera.x = player.x - game.width / 2;
      game.camera.y = player.y - game.height / 2;
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.02, 0.02);

      // add rats
      [{x: 48, y: 146}, {x: 368, y: 146}, {y: 326}, {x: 368, y: 326}]
        .map(pos => {
          const sprite = game.add.sprite(pos.x, pos.y);
          const cfg = {sprite, target: player, neighbors: rats, enemies};
          const rat = factories.entities.enemies.rat(cfg);

          return rat;
        })
        .forEach(rat => {
          rats.push(rat);
          enemies.push(rat);
          entities.add(rat);
        });
    },

    update() {
      // depth sort entities
      entities.sort('y', Phaser.Group.SORT_ASCENDING);

      // if all the bats are dead, spawn more! 2 add'l enemies each wave, for now
      if (bats.every(b => b.isDead)) {
        enemyCount += 2;
        utils.createArray(enemyCount)
          .map(e => {
            const pos = {x: utils.randomIntBetween(48, 358), y: utils.randomIntBetween(146, 326)};

            const sprite = game.add.sprite(pos.x, pos.y);
            const cfg = {sprite, target: player, neighbors: bats, enemies};
            const bat = factories.entities.enemies.bat(cfg);

            return bat;
          })
          .forEach(bat => {
            bats.push(bat);
            enemies.push(bat);
            entities.add(bat);
          });
      }
    }
  };

  return play;
};

module.exports = Play;
