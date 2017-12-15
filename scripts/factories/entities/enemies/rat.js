const enemyFactory = require('./generic');

const ratFactory = ({game, sprite, target, neighbors, enemies}) => {
  const movement = () => {
    const velocity = 1;
    const ratPos = new DE.Math.Vector(sprite.x, sprite.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    const seperationVector = DE.Steer.Behaviors.Seperation(ratPos, neighbors).Scale(0.05);
    const fleeVector = DE.Steer.Behaviors.Flee(ratPos, targetPos, velocity, 128);
    const cohesionVector = DE.Steer.Behaviors.Cohese(ratPos, neighbors, velocity);
    const vector = fleeVector
      .Add(seperationVector)
      .Add(cohesionVector);

    return vector;
  };

  const rat = enemyFactory({
    game,
    name: 'rat',
    sprite,
    target,
    neighbors,
    enemies,
    movement,
    fps: 18
  });

  return rat;
};

module.exports = ratFactory;
