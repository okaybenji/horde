* Is there some standard way to access the file system in JavaScript? If you stored animations with some standard structure and naming convention like [animation prefix]/[animation-name]-[number-of-frames] e.g. `walk/s-2.png`, all animations could be built automatically for you. You provide the location of the sprites, and the system explores it, finds all images, and creates the animations according to their folders and filenames. It could even automate creation of factories of entities with animations attached to them if the animations were placed in folders named after those entities, e.g. `player/walk/s-2.png`.

* Entity factories should return entities with their animations already attached. E.g.:

```
const newPlayer = entityFactories.player();
console.log(newPlayer.animations.walk_s); // <- [Object, Object]
```