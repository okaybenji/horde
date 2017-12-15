const spritesheets = require('../../../../data/spritesheets');
const behaviors = require('../behaviors');
const utils = require('../../../utils');

const enemyFactory = ({name, sprite, target, neighbors, enemies, movement, fps = 18, range = 20, hp = 20, atk = 0}) => {
  let enemy = sprite;
  const shouldLoop = true;

  enemy.loadTexture(name + '_move_e');
  enemy.dir = 'e';
  enemy.hp = hp;
  enemy.lastAttacked = 0;

  spritesheets
    .filter(spritesheet => spritesheet.entity === name)
    .forEach(spritesheet => enemy.animations.add(spritesheet.name));

  enemy.animations.play(name + '_move_e', fps, shouldLoop);

  enemy.actions = {
    takeDamage(amount) {
      behaviors.takeDamage(enemy, amount);
    },
    removeTint: behaviors.removeTint(enemy),
    die() {
      if (enemy.isDead) {
        enemy.kill(); // if the enemy already died, destroy it
        return;
      }

      // remove enemy from neighbors so we don't have to recheck that they're dead every frame
      // (note that doing this here will prevent enemies from avoiding dead buddies)
      const i = neighbors.indexOf(enemy);
      neighbors.splice(i, 1);

      // otherwise, kill it and leave a corpse
      const deathAnimation = name + '_die_' + enemy.dir;
      enemy.loadTexture(deathAnimation);
      enemy.animations.play(deathAnimation, fps);
      enemy.isDead = true;
    },
    attack() {
      const damage = atk;
      const numFrames = enemy.animations._anims[name + '_attack_e']._frames.length;
      const duration = 1000 / fps * numFrames; // attack duration = attack animation duration
      const interval = duration; // TODO: consider including an idle time between attacks

      const canAttack = Date.now() > enemy.lastAttacked + interval;
      if (!canAttack) {
        return;
      }

      enemy.lastAttacked = Date.now();

      // target takes damage half-way through the attack animation
      // (if the enemy and target are still alive and the target is still in range)
      setTimeout(() => {
        if(!enemy.isDead && !target.isDead && utils.targetIsInRange(enemy, target, range)) {
          target.actions.takeDamage(damage);
        }
      }, duration / 2);
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

    if (!target.isDead && utils.targetIsInRange(enemy, target, range)) {
      play(name + '_attack_' + enemy.dir);
      enemy.actions.attack(target);
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
  };

  enemy.onKilled = () => {
    // remove enemy from enemies since player can't hit it any longer
    const i = enemies.indexOf(enemy);
    enemies.splice(i, 1);

    // 1 in 5 enemies will drop a heart when their corpse is destroyed
    if (Math.random() < 0.2) {
      // TODO: Drop a heart!
    }
  };
  enemy.events.onKilled.add(enemy.onKilled, enemy);

  return enemy;
};

module.exports = enemyFactory;
