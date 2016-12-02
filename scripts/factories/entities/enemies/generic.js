const spritesheets = require('../../../../data/spritesheets');
const utils = require('../../../utils');

const enemyFactory = ({name, sprite, bounds, neighbors, movement, fps = 18}) => {
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

    if (vector.x > 0) {
      if (enemy.animations.currentAnim.name === name + '_move_w') {
        enemy.dir = 'e';
        enemy.loadTexture(name + '_move_e');
        enemy.animations.play(name + '_move_e', fps, shouldLoop);
      }
    } else if (vector.x < 0) {
      if (enemy.animations.currentAnim.name === name + '_move_e') {
        enemy.dir = 'w';
        enemy.loadTexture(name + '_move_w');
        enemy.animations.play(name + '_move_w', fps, shouldLoop);
      }
    }

    enemy.x += vector.x;
    enemy.y += vector.y;

    enemy = utils.keepInBounds(enemy, bounds);
  };

  return enemy;
};

module.exports = enemyFactory;
