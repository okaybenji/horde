const spritesheets = require('../../data/spritesheets');

// TODO: my ESLint doesn't like destructuring with defaults!
// TODO: look into creating player without passing it game
// game.add.sprite should happen in main.
// creation of keys object can be handled by another module, and keys would be passed into player.
const playerFactory = (game, { x = 0, y = 0, orientation = 'right', controls = {}, gamepad = game.input.gamepad.pad1 }) => {
  const defaultControls = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    shield: 'SPACEBAR',
    attack: 'SHIFT'
  };

  const ctrls = Object.assign({}, defaultControls, controls);

  const keys = {
    up: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.up]),
    down: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.down]),
    left: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.left]),
    right: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.right]),
    shield: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.shield]),
    attack: game.input.keyboard.addKey(Phaser.Keyboard[ctrls.attack]),
  };

  var actions = {
    attack: function attack() {
      var duration = 200;
      var interval = 600;
      var velocity = 100;
      const fps = 12;
      const shouldLoop = false;

      var canAttack = (Date.now() > player.lastAttacked + interval) && !player.isDodging;
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
      const speed = 2;
      const fps = 12;
      const shouldLoop = false;

      player.dir = direction;

      switch (direction) {
        case 'w':
          player.x -= speed;
          break;
        case 'e':
          player.x += speed;
          break;
        case 'n':
          player.y -= speed;
          break;
        case 's':
          player.y += speed;
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

  let player = game.add.sprite(x, y, 'walk_s');
  player.dir = 's';

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

  };

  return player;
};

module.exports = playerFactory;