// An item which gives player additional health
const utils = require('../../utils');

const heartFactory = ({ sprite, player }) => {
  let heart = sprite;

  heart.loadTexture('heart');
  game.physics.arcade.enable(heart);

  heart.update = function() {
    game.physics.arcade.collide(player, heart, () => {
      console.log('healing player & killing heart');
      player.actions.heal(30);
      heart.kill();
    });
  };

  return heart;
};

module.exports = heartFactory;
