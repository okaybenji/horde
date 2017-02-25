const Play = (game) => {
  const spritesheets = require('../../data/spritesheets');
  const bats = [];
  const rats = [];
  const enemies = [];
  let player;
  let boundary;
  let entities;

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
      const map = game.add.tilemap('dungeon');
      map.addTilesetImage('dungeon', 'dungeon');
      map.createLayer('Base');
      boundary = map.createLayer('Bounds');
      map.createLayer('Decorations');
      map.createLayer('Foreground');

      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.setCollisionBetween(1, 100000, true, 'Bounds');

      const bounds = {x: 0, y: 0, width: 512, height: 512};
      entities = game.add.group();

      player = factories.entities.player({
        sprite: game.add.sprite(200, 228),
        keys: factories.keys(game),
        gamepad: game.input.gamepad.pad1,
        bounds,
        enemies, //  for now, passing enemies to player to allow killing them... come up with better solution
        game // adding this back in for now. remove it when you figure out how to do the sword w/o it!
      });
      game.physics.arcade.enable(player);
      entities.add(player);

      // camera lerp
      game.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
      // start camera at player's position (from top left rather than center)
      game.camera.x = player.x - game.width / 2;
      game.camera.y = player.y - game.height / 2;
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.02, 0.02);

      [{x: 48, y: 146}, {x: 368, y: 146}, {y: 326}, {x: 368, y: 326}]
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: bats, bounds}))
        .map(cfg => factories.entities.enemies.bat(cfg))
        .forEach(bat => {
          bats.push(bat);
          enemies.push(bat);
          entities.add(bat);
        });

      [{x: 48, y: 146}, {x: 368, y: 146}, {y: 326}, {x: 368, y: 326}]
        .map(pos => game.add.sprite(pos.x, pos.y))
        .map(sprite => ({sprite, target: player, neighbors: rats, bounds}))
        .map(cfg => factories.entities.enemies.rat(cfg))
        .forEach(rat => {
          rats.push(rat);
          enemies.push(rat);
          entities.add(rat);
        });

    },

    update() {
      // depth sort entities
      entities.sort('y', Phaser.Group.SORT_ASCENDING);
      // collide entities
      game.physics.arcade.collide(player, boundary, function() {
        console.log('player:', player, 'collided with boundary:', boundary);
      });
    }
  };
  
  return play;
};

module.exports = Play;
