const behaviors = {
  takeDamage: (entity, amount) => {
    entity.tint = 0xFF0000;
    entity.alpha = 0.75;
    setTimeout(() => {
      if (entity) {
        entity.tint = 0xFFFFFF;
        entity.alpha = 1;
      }
    }, 100);

    entity.hp -= amount;

    if (entity.hp <= 0) {
      entity.hp = 0;
      entity.actions.die();
    }
  },
};

module.exports = behaviors;