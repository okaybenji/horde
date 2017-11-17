const spritesheets = [
  // TODO: access the filesystem to build this array automatically
  'player/attack_e-3.png',
  'player/attack_n-3.png',
  'player/attack_s-3.png',
  'player/attack_w-3.png',
  'player/roll_e-3.png',
  'player/roll_n-3.png',
  'player/roll_s-3.png',
  'player/roll_w-3.png',
  'player/shield_e-1.png',
  'player/shield_n-1.png',
  'player/shield_s-1.png',
  'player/shield_w-1.png',
  'player/walk_e-2.png',
  'player/walk_n-2.png',
  'player/walk_s-2.png',
  'player/walk_w-2.png',
  'player/slash_e-3.png',
  'player/slash_n-3.png',
  'player/slash_s-3.png',
  'player/slash_w-3.png',
  'bat/move_w-10.png',
  'bat/move_e-10.png',
  'bat/attack_w-10.png',
  'bat/attack_e-10.png',
  'bat/idle_w-10.png',
  'bat/idle_e-10.png',
  'bat/die_w-10.png',
  'bat/die_e-10.png',
  'rat/move_w-10.png',
  'rat/move_e-10.png',
  'rat/attack_w-10.png',
  'rat/attack_e-10.png',
  'rat/idle_w-10.png',
  'rat/idle_e-10.png',
  'rat/die_w-10.png',
  'rat/die_e-10.png'
].map((asset, i) => {
  const slash = asset.indexOf('/');
  const underscore = asset.indexOf('_');
  const dash = asset.indexOf('-');
  const dot = asset.indexOf('.');

  const entity = asset.slice(0, slash);
  const name = entity + '_' + asset.slice(slash + 1, dash);
  const frameCount = Number(asset.slice(dash + 1, dot));
  const path = '../../assets/images/' + asset;

  // TODO: apparently watchify doesn't like (()=>())
  const image = (function() {
    const image = new Image();
    image.src = path;
    return image;
  }());

  return { entity, name, frameCount, image };
});

module.exports = spritesheets;
