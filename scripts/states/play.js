const spritesheets = require('../../data/spritesheets');
const createPlayer = require('../player');
let bats, player;

const Play = (game) => {
  const play = {
    create() {
      game.add.sprite(-48, -146, 'arena');

      bats = [{}, {x: 320}, {y: 180}, {x: 320, y: 180}]
        .map((cfg) => {
          const bat = game.add.sprite(cfg.x || 0, cfg.y || 0, 'bat_fly_e');
          spritesheets
            .filter(spritesheet => spritesheet.entity === 'enemies')
            .forEach(spritesheet => bat.animations.add(spritesheet.name));
          const shouldLoop = true;
          bat.animations.play('bat_fly_e', 30, shouldLoop);

          return bat;
        });

      player = createPlayer(game, {x: 152, y: 82});
    },

    update() {
      bats = bats.map((bat) => {
        const velocity = 1;
        const batPos = new DE.Math.Vector(bat.x, bat.y);
        const playerPos = new DE.Math.Vector(player.x, player.y);
        //const seekVector = DE.Steer.Behaviors.Arrive(batPos, playerPos, velocity);
        const fleeVector = DE.Steer.Behaviors.Flee(batPos, playerPos, velocity, 128);
        const seperationVector = DE.Steer.Behaviors.Seperation(batPos, bats).Scale(0.02);
        const cohesionVector = DE.Steer.Behaviors.Cohese(batPos, bats, velocity);
        const vector = fleeVector
          .Add(seperationVector)
          .Add(cohesionVector);
        bat.x += vector.x;
        bat.y += vector.y;

        return bat;
      });
    }
  };
  
  return play;
};

module.exports = Play;
