const enemyFactory = require('./generic');

const batFactory = ({sprite, target, neighbors, bounds}) => {
  const movement = () => {
    const velocity = 1;
    const batPos = new DE.Math.Vector(sprite.x, sprite.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    const seekVector = DE.Steer.Behaviors.Arrive(batPos, targetPos, velocity);
    const seperationVector = DE.Steer.Behaviors.Seperation(batPos, neighbors).Scale(0.05);
    const cohesionVector = DE.Steer.Behaviors.Cohese(batPos, neighbors, velocity);
    const vector = seekVector
      .Add(seperationVector)
      .Add(cohesionVector);

    return vector;
  };

  const bat = enemyFactory({
    name: 'bat',
    sprite,
    neighbors,
    bounds,
    movement,
    fps: 30
  });

  return bat;
};

module.exports = batFactory;
