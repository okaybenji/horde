const utils = {
  resize: (game) => {
    document.body.style.zoom = window.innerWidth / game.width;
  },
  // adapted from underscore
  debounce: (func, wait, immediate) => {
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
  keepInBounds(entity, bounds) {
    if (entity.x < bounds.x) {
      entity.x = bounds.x;
    } else if (entity.x + entity.width > bounds.x + bounds.width) {
      entity.x = bounds.x + bounds.width - entity.width;
    }

    if (entity.y < bounds.y) {
      entity.y = bounds.y;
    } else if (entity.y + entity.height > bounds.y + bounds.height) {
      entity.y = bounds.y + bounds.height - entity.height;
    }

    return entity;
  }
};

module.exports = utils;
