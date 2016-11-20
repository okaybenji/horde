const spritesheets = require('../../../../data/spritesheets');
const utils = require('../../../utils');

const batFactory = ({sprite, target, neighbors, bounds}) => {
  let bat = sprite;
  const fps = 30;
  const shouldLoop = true;

  bat.loadTexture('bat_fly_e');

  spritesheets
    .filter(spritesheet => spritesheet.entity === 'enemies')
    .forEach(spritesheet => bat.animations.add(spritesheet.name));

  bat.animations.play('bat_fly_e', fps, shouldLoop);

  bat.actions = {
    die: () => bat.kill()
  };

  bat.update = () => {
    const velocity = 1;
    const batPos = new DE.Math.Vector(bat.x, bat.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    const seekVector = DE.Steer.Behaviors.Arrive(batPos, targetPos, velocity);
    const seperationVector = DE.Steer.Behaviors.Seperation(batPos, neighbors).Scale(0.05);
    const cohesionVector = DE.Steer.Behaviors.Cohese(batPos, neighbors, velocity);
    const vector = seekVector
      .Add(seperationVector)
      .Add(cohesionVector);

    if (vector.x > 0) {
      if (bat.animations.currentAnim.name === 'bat_fly_w') {
        bat.loadTexture('bat_fly_e');
        bat.animations.play('bat_fly_e', fps, shouldLoop);
      }
    } else if (vector.x < 0) {
      if (bat.animations.currentAnim.name === 'bat_fly_e') {
        bat.loadTexture('bat_fly_w');
        bat.animations.play('bat_fly_w', fps, shouldLoop);
      }
    }

    bat.x += vector.x;
    bat.y += vector.y;

    bat = utils.keepInBounds(bat, bounds);
  };

  return bat;
};

module.exports = batFactory;
