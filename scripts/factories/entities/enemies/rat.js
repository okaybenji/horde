// TODO: pull common functionality between bat and rat into shareable component
const spritesheets = require('../../../../data/spritesheets');

const ratFactory = ({sprite, target, neighbors, bounds}) => {
  const rat = sprite;
  const fps = 18;
  const shouldLoop = true;

  rat.loadTexture('rat_walk_e');

  spritesheets
    .filter(spritesheet => spritesheet.entity === 'enemies')
    .forEach(spritesheet => rat.animations.add(spritesheet.name));

  rat.animations.play('rat_walk_e', fps, shouldLoop);

  rat.update = () => {
    const velocity = 1;
    const ratPos = new DE.Math.Vector(rat.x, rat.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    // const seekVector = DE.Steer.Behaviors.Arrive(ratPos, targetPos, velocity);
    const seperationVector = DE.Steer.Behaviors.Seperation(ratPos, neighbors).Scale(0.05);
    const fleeVector = DE.Steer.Behaviors.Flee(ratPos, targetPos, velocity, 128);
    const cohesionVector = DE.Steer.Behaviors.Cohese(ratPos, neighbors, velocity);
    // const vector = seekVector.Add(seperationVector);
    const vector = fleeVector
      .Add(seperationVector)
      .Add(cohesionVector);

    if (vector.x > 0) {
      if (rat.animations.currentAnim.name === 'rat_walk_w') {
        rat.loadTexture('rat_walk_e');
        rat.animations.play('rat_walk_e', fps, shouldLoop);
      }
    } else if (vector.x < 0) {
      if (rat.animations.currentAnim.name === 'rat_walk_e') {
        rat.loadTexture('rat_walk_w');
        rat.animations.play('rat_walk_w', fps, shouldLoop);
      }
    }

    rat.x += vector.x;
    rat.y += vector.y;

    // collide with world bounds
    if (rat.x < bounds.x) {
      rat.x = bounds.x;
    } else if (rat.x + rat.width > bounds.x + bounds.width) {
      rat.x = bounds.x + bounds.width - rat.width;
    }

    if (rat.y < bounds.y) {
      rat.y = bounds.y;
    } else if (rat.y + rat.height > bounds.y + bounds.height) {
      rat.y = bounds.y + bounds.height - rat.height;
    }
  };

  return rat;
};

module.exports = ratFactory;
