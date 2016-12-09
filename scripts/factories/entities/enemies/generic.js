const spritesheets = require('../../../../data/spritesheets');
const utils = require('../../../utils');

const enemyFactory = ({name, sprite, bounds, target, neighbors, movement, fps = 18, range = 20}) => {
  let enemy = sprite;
  const shouldLoop = true;

  enemy.loadTexture(name + '_move_e');
  enemy.dir = 'e';

  spritesheets
    .filter(spritesheet => spritesheet.entity === name)
    .forEach(spritesheet => enemy.animations.add(spritesheet.name));

  enemy.animations.play(name + '_move_e', fps, shouldLoop);

  enemy.actions = {
    die() {
      if (enemy.isDead) {
        enemy.kill(); // if the enemy already died, destroy it
        // remove enemy from list
        const i = neighbors.indexOf(enemy);
        neighbors.splice(i, 1);
        return;
      }

      // otherwise, kill it and leave a corpse
      const deathAnimation = name + '_die_' + enemy.dir;
      enemy.loadTexture(deathAnimation);
      enemy.animations.play(deathAnimation, fps);
      enemy.isDead = true;
    }
  };

  enemy.update = () => {
    if (enemy.isDead) {
      return;
    }

    const vector = movement();
    const play = (animationName) => {
      if (enemy.animations.currentAnim.name !== animationName) {
        enemy.loadTexture(animationName);
        enemy.animations.play(animationName, fps, shouldLoop);
      }
    };

    if (enemy.x > target.x - range && enemy.x < target.x + range) {
      play(name + '_attack_' + enemy.dir);
    } else {
      if (vector.x > 0.01) {
        enemy.dir = 'e';
        play(name + '_move_e');
      } else if (vector.x < -0.01) {
        enemy.dir = 'w';
        play(name + '_move_w');
      } else {
        play(name + '_idle_' + enemy.dir);
      }
    }


    enemy.x += vector.x;
    enemy.y += vector.y;

    enemy = utils.keepInBounds(enemy, bounds);
  };

  return enemy;
};

module.exports = enemyFactory;
