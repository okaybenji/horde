// TODO: pull common functionality between bat and rat into shareable component
const spritesheets = require('../../../../data/spritesheets');
const utils = require('../../../utils');

const ratFactory = ({sprite, target, neighbors, bounds}) => {
  let rat = sprite;
  const fps = 18;
  const shouldLoop = true;

  rat.loadTexture('rat_walk_e');
  rat.dir = 'e';

  spritesheets
    .filter(spritesheet => spritesheet.entity === 'enemies')
    .forEach(spritesheet => rat.animations.add(spritesheet.name));

  rat.animations.play('rat_walk_e', fps, shouldLoop);

  rat.actions = {
    die() {
      if (rat.isDead) {
        rat.kill(); // if the rat already died, destroy it
        return;
      }

      const deathAnimation = 'rat_die_' + rat.dir;
      rat.loadTexture(deathAnimation);
      rat.animations.play(deathAnimation, fps);
      rat.isDead = true;
    }
  };

  rat.update = () => {
    if (rat.isDead) {
      return;
    }

    const velocity = 1;
    const ratPos = new DE.Math.Vector(rat.x, rat.y);
    const targetPos = new DE.Math.Vector(target.x, target.y);
    const seperationVector = DE.Steer.Behaviors.Seperation(ratPos, neighbors).Scale(0.05);
    const fleeVector = DE.Steer.Behaviors.Flee(ratPos, targetPos, velocity, 128);
    const cohesionVector = DE.Steer.Behaviors.Cohese(ratPos, neighbors, velocity);
    const vector = fleeVector
      .Add(seperationVector)
      .Add(cohesionVector);

    if (vector.x > 0) {
      if (rat.animations.currentAnim.name === 'rat_walk_w') {
        rat.dir = 'e';
        rat.loadTexture('rat_walk_e');
        rat.animations.play('rat_walk_e', fps, shouldLoop);
      }
    } else if (vector.x < 0) {
      if (rat.animations.currentAnim.name === 'rat_walk_e') {
        rat.dir = 'w';
        rat.loadTexture('rat_walk_w');
        rat.animations.play('rat_walk_w', fps, shouldLoop);
      }
    }

    rat.x += vector.x;
    rat.y += vector.y;

    rat = utils.keepInBounds(rat, bounds);
  };

  return rat;
};

module.exports = ratFactory;
