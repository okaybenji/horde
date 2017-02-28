const spritesheets = require('../../../data/spritesheets');
const behaviors = require('./behaviors');
const utils = require('../../utils');

const playerFactory = ({ game, sprite, keys, gamepad, /*bounds, enemies = [],*/ dir = 's', hp = 100 }) => {
  let player = sprite;

  // used to allow sub-pixel movement without introducing sprite artifacts
  player.subX = player.x;
  player.subY = player.y;

  const actions = {
    removeTint: behaviors.removeTint(player),
    attack: function attack() {
      if (player.isDead) {
        return;
      }

      const duration = 200;
      const interval = 600;
      const velocity = 100;
      const fps = 12;
      const shouldLoop = false;

      const canAttack = (Date.now() > player.lastAttacked + interval) && !player.isDodging;
      if (!canAttack) {
        return;
      }

      player.isAttacking = true;
      player.lastAttacked = Date.now();

      player.loadTexture('player_attack_' + player.dir);
      player.animations.play('player_attack_' + player.dir, fps, shouldLoop);
      setTimeout(actions.endAttack, duration);

      // create sword slash
      const slashAnimation = 'player_slash_' + player.dir;
      const slashX = player.dir === 'e' ? 8
        : player.dir === 'w' ? -8
        : 0;
      const slashY = player.dir === 's' ? 8
        : player.dir === 'n' ? -8
        : 0;
      const slash = game.add.sprite(player.x + slashX, player.y + slashY, slashAnimation);
      slash.animations.add(slashAnimation);
      slash.animations.play(slashAnimation, fps);
      slash.animations.currentAnim.onComplete.add(() => slash.kill());

      // kill enemies that were struck
      game.stage.updateTransform(); // ensure slash bounds exist

//      const checkOverlap = (spriteA, spriteB) => {
//        const boundsA = spriteA.getBounds();
//        const boundsB = spriteB.getBounds();
//
//        return Phaser.Rectangle.intersects(boundsA, boundsB);
//      };

//      const damage = 10;
//      enemies
//        .filter(enemy => checkOverlap(slash, enemy))
//        .forEach(hitEnemy => hitEnemy.actions.takeDamage(damage));
    },

    endAttack: function endAttack() {
      player.isAttacking = false;
      player.loadTexture('player_walk_' + player.dir);
    },

    walk: function walk(direction) {
      if (player.isDead) {
        return;
      }

      // TODO: sub-pixel movement is not as smooth
      // a speed of e.g. 2 looks/feels smoother
      // can anything be done about this?
      const speed = 1.5;
      const fps = 12;
      const shouldLoop = false;
      let position = {x: player.subX, y: player.subY, width: player.width, height: player.height};

      player.dir = direction;

      switch (direction) {
        case 'w':
          position.x -= speed;
          break;
        case 'e':
          position.x += speed;
          break;
        case 'n':
          position.y -= speed;
          break;
        case 's':
          position.y += speed;
          break;
      }

//      position = utils.keepInBounds(position, bounds);
      player.subX = position.x;
      player.subY = position.y;

      if (!player.animations.currentAnim.isPlaying) {
        player.loadTexture('player_walk_' + player.dir);
        player.animations.play('player_walk_' + player.dir, fps, shouldLoop);
      }
    },

    shield() {
      if (player.isAttacking) {
        return;
      }

      player.loadTexture('player_shield_' + player.dir);
    },

    takeDamage(amount) {
      behaviors.takeDamage(player, amount);
    },

    die: function() {
      player.isDead = true;
      player.angle = 45;
      // game.sfx.play('die');
      // actions.endAttack();
      // player.lastAttacked = 0;
    }
  };

  player.loadTexture('player_walk_' + dir);
  player.dir = dir;
  player.hp = hp;

  spritesheets
    .filter(spritesheet => spritesheet.entity === 'player')
    .forEach(spritesheet => player.animations.add(spritesheet.name));

  player.isDead = false;
  player.isDodging = false;
  player.isAttacking = false;
  player.lastAttacked = 0;

  // phaser automatically calls any function named update attached to a sprite
  player.update = function() {
    const input = {
      left:   (keys.left.isDown && !keys.right.isDown) ||
              (gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) && !gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.1,
      right:  (keys.right.isDown && !keys.left.isDown) ||
              (gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) && !gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.1,
      up:     keys.up.isDown ||
              gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
              gamepad.isDown(Phaser.Gamepad.XBOX360_A),
      down:   keys.down.isDown ||
              gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 ||
              gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.1,
      attack: keys.attack.isDown ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_X) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_Y) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_B) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_LEFT_BUMPER) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_LEFT_TRIGGER) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER) ||
              gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER),
      shield: keys.shield.isDown
    };

    // player cannot walk while shield is up
    if (input.shield) {
      actions.shield();
    } else {
      if (input.left) {
        actions.walk('w');
      }

      if (input.right) {
        actions.walk('e');
      }

      if (input.up) {
        actions.walk('n');
      }

      if (input.down) {
        actions.walk('s');
      }

      if (!input.left && !input.right && !input.up && !input.down && !player.isAttacking) {
        // stop animation / lower shield
        player.loadTexture('player_walk_' + player.dir);
      }
    }

    if (input.attack) {
      actions.attack();
    }

    player.x = Math.round(player.subX);
    player.y = Math.round(player.subY);
  };

  player.actions = actions;

  return player;
};

module.exports = playerFactory;