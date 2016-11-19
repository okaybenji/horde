const spritesheets = require('../../../data/spritesheets');

const batFactory = (game, {x, y, target, neighbors}) => {
  const fps = 30;
  const shouldLoop = true;

  const bat = game.add.sprite(x || 0, y || 0, 'bat_fly_e');
  spritesheets
    .filter(spritesheet => spritesheet.entity === 'enemies')
    .forEach(spritesheet => bat.animations.add(spritesheet.name));

  bat.animations.play('bat_fly_e', 30, shouldLoop);

  bat.update = () => {
    const velocity = 1;
    const batPos = new DE.Math.Vector(bat.x, bat.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    // const seekVector = DE.Steer.Behaviors.Arrive(batPos, targetPos, velocity);
    const fleeVector = DE.Steer.Behaviors.Flee(batPos, targetPos, velocity, 128);
    const seperationVector = DE.Steer.Behaviors.Seperation(batPos, neighbors).Scale(0.02);
    const cohesionVector = DE.Steer.Behaviors.Cohese(batPos, neighbors, velocity);
    const vector = fleeVector
      .Add(seperationVector)
      .Add(cohesionVector);
    // const vector = seekVector;
    bat.x += vector.x;
    bat.y += vector.y;

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

    return bat;
  };

  return bat;
};

module.exports = batFactory;
