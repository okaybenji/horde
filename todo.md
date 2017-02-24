* Is there some standard way to access the file system in JavaScript? If you stored animations with some standard structure and naming convention like [animation prefix]/[animation-name]-[number-of-frames] e.g. `walk/s-2.png`, all animations could be built automatically for you. You provide the location of the sprites, and the system explores it, finds all images, and creates the animations according to their folders and filenames. It could even automate creation of factories of entities with animations attached to them if the animations were placed in folders named after those entities, e.g. `player/walk/s-2.png`.

* Why does the camera tracking system not center player when moving down, but it does when moving up? And right, but not left?

* Add tree shaking to build process.

* Look into using ES6 import/export (Browserify doesn't seem to like it atm... maybe switch to Webpack or Rollup)

* If an entity is seeking the player from the direction the player is facing and is not already overlapping the player, and the player is holding up her shield, entity should collide with the shield and not be able to move closer to the player than the shield's position.

* Give player a dodge/roll action.

* Upgrade player with a three-stage attack (if timed correctly): quick, quick, long. If second or third stage not activated in a timely fashion, player must wait normal fixed duration before attacking again. Long attack does more damage.

* Add collision to Bounds tilemap layer

* Credit Buch for A Block Dungeon (http://opengameart.org/content/a-blocky-dungeon)
