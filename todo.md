* Add collision detection so our entities will not overlap however hard they may try.
* Is there some standard way to access the file system in JavaScript? If you stored animations with some standard structure and naming convention like [animation prefix]/[animation-name]-[number-of-frames] e.g. `walk/s-2.png`, all animations could be built automatically for you. You provide the location of the sprites, and the system explores it, finds all images, and creates the animations according to their folders and filenames. It could even automate creation of factories of entities with animations attached to them if the animations were placed in folders named after those entities, e.g. `player/walk/s-2.png`.

* Entity factories should return entities with their animations already attached. E.g.:

```
const newPlayer = entityFactories.player();
console.log(newPlayer.animations.walk_s); // <- [Object, Object]
```

* Look into polling inputs manually each frame. If you did this, you could remove event listeners and write more functional code (but obvs still depends on external state).

* Update loop to accept state (with players, arena, etc). Updated state should be passed into each recursive call. Since state will be a deep object, something like this will be necessary:
https://github.com/sindresorhus/deep-assign/

* Create camera system. If player moves beyond a buffer zone, camera (and buffer zone) should follow him at the player's speed. Once player stops moving, camera should decelerate and tween to center player in buffer zone.