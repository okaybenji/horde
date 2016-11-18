let bat, player;

const Play = (game) => {
  const play = {
    create() {
      game.add.sprite(-48, -146, 'arena');

      bat = game.add.sprite(0, 0, 'bat_fly_e');
      const shouldLoop = true;
      bat.animations.add('fly');
      bat.animations.play('fly', 30, shouldLoop);

      player = game.add.sprite(152, 82, 'shield_s');
    },

    update() {
      const velocity = 1;
      const batPos = new DE.Math.Vector(bat.x, bat.y);
      const playerPos = new DE.Math.Vector(player.x, player.y);
      const seekVector = DE.Steer.Behaviors.Arrive(batPos, playerPos, velocity);

      bat.x += seekVector.x;
      bat.y += seekVector.y;
    }
  };
  
  return play;
};

module.exports = Play;
