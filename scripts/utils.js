const utils = {
  resize(game) {
    document.body.style.zoom = window.innerWidth / game.width;
  },
  // adapted from underscore
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  },

  targetIsInRange(entity, target, range) {
    return entity.x > target.x - range &&
           entity.x < target.x + range &&
           entity.y > target.y - range &&
           entity.y < target.y + range;
  },

  createArray: length => new Array(length).fill(0),
  randomIntBetween: (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min,
};

module.exports = utils;
