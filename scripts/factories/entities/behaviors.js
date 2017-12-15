const utils = require('../../utils');

const behaviors = {
  takeDamage(entity, amount) {
    entity.tint = 0xFF0000;
    entity.alpha = 0.75;

    entity.actions.removeTint();

    entity.hp -= amount;

    if (entity.hp <= 0) {
      entity.hp = 0;
      entity.actions.die();
    }
  },
  heal(entity, amount) {
    entity.tint = 0x00FF00;
    entity.actions.removeTint();

    entity.hp += amount;

    if (entity.hp > entity.maxHp) {
      entity.hp = entity.maxHp;
    }
  },
  removeTint(entity) {
    return utils.debounce(() => {
      if (entity) {
        entity.tint = 0xFFFFFF;
        entity.alpha = 1;
      }
    }, 100);
  }
};

module.exports = behaviors;
