const spritesheets = require('../../../data/spritesheets');

const playerFactory = ({ sprite, keys, gamepad, dir = 's' }) => {
  const player = sprite;

  // used to allow sub-pixel movement without introducing sprite artifacts
  player.subX = player.x;
  player.subY = player.y;

  const actions = {
    attack: function attack() {
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

      player.loadTexture('attack_' + player.dir);
      player.animations.play('attack_' + player.dir, fps, shouldLoop);
      setTimeout(actions.endAttack, duration);
    },

    endAttack: function endAttack() {
      player.isAttacking = false;
      player.loadTexture('walk_' + player.dir);
    },

    walk: function walk(direction) {
      // TODO: sub-pixel movement is not as smooth
      // a speed of e.g. 2 looks/feels smoother
      // can anything be done about this?
      const speed = 1.5;
      const fps = 12;
      const shouldLoop = false;

      player.dir = direction;

      switch (direction) {
        case 'w':
          player.subX -= speed;
          break;
        case 'e':
          player.subX += speed;
          break;
        case 'n':
          player.subY -= speed;
          break;
        case 's':
          player.subY += speed;
          break;
      }

      if (!player.animations.currentAnim.isPlaying) {
        player.loadTexture('walk_' + player.dir);
        player.animations.play('walk_' + player.dir, fps, shouldLoop);
      }
    },

    shield() {
      if (player.isAttacking) {
        return;
      }

      player.loadTexture('shield_' + player.dir);
    },

    takeDamage: function takeDamage(amount) {
      player.hp -= amount;

      if (player.hp < 0) {
        player.hp = 0;
        actions.die();
      }
    },

    die: function() {
      // game.sfx.play('die');
      // actions.endAttack();
      // player.lastAttacked = 0;
    }
  };

  player.loadTexture('walk_' + dir);
  player.dir = dir;

  spritesheets
    .filter(spritesheet => spritesheet.entity === 'player')
    .forEach(spritesheet => player.animations.add(spritesheet.name));

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
        player.loadTexture('walk_' + player.dir);
      }
    }

    if (input.attack) {
      actions.attack();
    }

    player.x = Math.round(player.subX);
    player.y = Math.round(player.subY);
  };

  return player;
};

module.exports = playerFactory;