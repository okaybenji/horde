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
  'enemies/bat_fly_w-10.png',
  'enemies/bat_fly_e-10.png',
  'enemies/rat_walk_w-10.png',
  'enemies/rat_walk_e-10.png'
].map((asset, i) => {
  const slash = asset.indexOf('/');
  const dash = asset.indexOf('-');
  const dot = asset.indexOf('.');

  return {
    entity: asset.slice(0, slash),
    name: asset.slice(slash + 1, dash),
    frameCount: Number(asset.slice(dash + 1, dot)),
    // TODO: apparently watchify doesn't like (()=>())
    image: (function() {
      const image = new Image();
      image.src = '../../assets/images/' + asset;
      return image;
    }())
  };
});

module.exports = spritesheets;
