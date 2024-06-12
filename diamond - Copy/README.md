#first intall the package

```properties
npm install diamond-game
```

#then create html file like this :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Game</title>
  </head>
  <body style="padding: 0px;margin: 0px;overflow:hidden">
    <canvas
      style="width: 100vw;height: 100vh;margin: 0px;"
      id="canvas"
    ></canvas>
    <script type="module" src="./test.js"></script>
  </body>
</html>
```

#you can test the package like this :

```js
// test.js
import Game from "./node_modules/diamond-game/dist/index.js";
let { test } = Game("canvas");
//test with simple game
test();
```

#then you can create your own game :

```js
import Game from "./node_modules/diamond-game/dist/index.js";
let {
  loop,
  canvas,
  drawObject,
  GameObject,
  Controller,
  Gravity,
  backInside,
  Movement,
} = Game("canvas", ["NoTest"]);
//create player object
let player = new GameObject({
  src: "https://picsum.photos/id/6/200/200",
  swidth: 200,
  sheight: 200,
  sposition: { sx: 0, sy: 0 },
  width: 50,
  height: 50,
  position: { x: 0, y: 0 },
  speed: 2,
});
let dir = {
  x: 0,
  y: 0,
};
//make controller
let controller = new Controller({
  keydown: (e, object) => {
    switch (e.code) {
      case "KeyD":
        dir.x = object.speed;
        break;
      case "KeyA":
        dir.x = -object.speed;
        break;
      case "KeyW":
        dir.y = -object.speed;
        break;
      case "KeyS":
        dir.y = object.speed;
        break;
    }
  },
  keyup: (e, object) => {
    switch (e.code) {
      case "KeyD":
        dir.x = 0;
        break;
      case "KeyA":
        dir.x = 0;
        break;
      case "KeyW":
        dir.y = 0;
        break;
      case "KeyS":
        dir.y = 0;
        break;
    }
  },
}).controller;
//movement function will create movement for player by controller
let movement = Movement(player, controller);
// loop function will run each frame
loop(() => {
  //you can uncomment it to set gravity to player
  //Gravity([player],10);

  //get back inside player if it exit the canvas
  backInside(player);
  //set player position by dir that is set by controller
  player.position.x += dir.x;
  player.position.y += dir.y;
  //draw player
  drawObject(player);
});
```
