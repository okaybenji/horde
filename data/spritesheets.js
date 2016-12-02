const spritesheets = [
  // TODO: access the filesystem to build this array automatically
  'player/attack_e-3.png',
  'player/attack_s-3.png',
  'player/roll_e-3.png',
  'player/roll_s-3.png',
  'player/shield_e-1.png',
  'player/shield_s-1.png',
  'player/walk_e-2.png',
  'player/walk_s-2.png',
  'player/slash_e-3.png',
  'player/slash_s-3.png',
  'bat/move_e-10.png',
  'bat/die_e-10.png',
  'rat/move_e-10.png',
  'rat/die_e-10.png'
].map((asset, i) => {
  const slash = asset.indexOf('/');
  const underscore = asset.indexOf('_');
  const dash = asset.indexOf('-');
  const dot = asset.indexOf('.');

  const entity = asset.slice(0, slash);
  const name = entity + '_' + asset.slice(slash + 1, dash);
  const direction = asset.slice(underscore + 1, dash);
  const frameCount = Number(asset.slice(dash + 1, dot));
  const src = '../../assets/images/' + asset;
  // TODO: apparently watchify doesn't like (()=>())
  const image = (function() {
    const image = new Image();
    image.src = src;
    return image;
  }());

  return { entity, name, direction, frameCount, image, src };
});

module.exports = spritesheets;
