var snakeboard = document.getElementById("snakeboard");
var snakeboard_ctx = snakeboard.getContext("2d");

class Pos {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Obstacle {
  pos;
  dim;
  hitboxes;
  key;

  constructor(pos, dim, hitboxes, key) {
    this.pos = pos;
    this.dim = dim;
    this.hitboxes = hitboxes;
    this.key = key;
  }
}

var speed = 200;
var score = 0;
var snake = [new Pos(100, 200), new Pos(90, 200), new Pos(80, 200)];
var apple = new Pos(snakeboard.width / 2, snakeboard.height / 2);
var obstacles = [];
var da = new Pos(10, 0);

main();
document.addEventListener("keydown", change_dir);

function gen_apple_pos() {
  return new Pos(
    Math.floor(Math.random() * 40) * 10,
    Math.floor(Math.random() * 40) * 10
  );
}

function gen_obstacle_pos() {
  let p = new Pos(
    Math.floor(Math.random() * 34) * 10 + 30,
    Math.floor(Math.random() * 34) * 10 + 30
  );
  if (hit_obstacle(p)) {
    return gen_obstacle_pos();
  } else {
    return p;
  }
}

function gen_obstacle_dim() {
  let d = new Pos(
    Math.floor(Math.random() * 3) * 10,
    Math.floor(Math.random() * 3) * 10
  );
  if (d.x === 0 || d.y === 0) {
    return gen_obstacle_dim();
  } else {
    return d;
  }
}

function gen_apple() {
  let p = gen_apple_pos();
  if (hit_obstacle(p)) {
    gen_apple;
  } else {
    apple = p;
  }
}

// breaks down obstacles into 10x10 grid coordinates automatically, saving typing effort
function break_down_obstacles(dim, arrayIndex) {
  // the grid dimensions if each grid square was 10 pixels on one side
  let grid_dim_x = dim.x / 10;
  let grid_dim_y = dim.y / 10;

  // it loops through the 10x10 pixel grid dimensions (basically one side of the obstacles divided by 10)
  // and it goes through row by row computing the hitbox coordinates
  let hboxes = [];
  for (let i = 0; i < grid_dim_y; i++) {
    for (let j = 0; j < grid_dim_x; j++) {
      hboxes.push(
        new Pos(
          obstacles[arrayIndex].pos.x + 10 * j,
          obstacles[arrayIndex].pos.y + 10 * i
        )
      );
    }
  }
  return hboxes;
}

function obs_key() {
  return Math.floor(Math.random() * 1000);
}

function gen_obstacle() {
  let o = new Obstacle(gen_obstacle_pos(), gen_obstacle_dim(), [], obs_key());
  obstacles.push(o);
  obstacles[obstacles.length - 1].hitboxes = break_down_obstacles(
    o.dim,
    obstacles.length - 1
  );
}

function draw_object(fstyle, pos, dim) {
  snakeboard_ctx.fillStyle = fstyle;
  snakeboard_ctx.fillRect(pos.x, pos.y, dim.x, dim.y);
  snakeboard_ctx.strokeRect(pos.x, pos.y, dim.x, dim.y);
}

function draw_snake() {
  snake.forEach(function (pos) {
    draw_object("green", pos, new Pos(10, 10));
  });
}

function draw_obstacles() {
  obstacles.forEach(function (obs) {
    draw_object("silver", obs.pos, obs.dim);
  });
}

function apple_eaten() {
  score++;
  speed -= 5;
  document.getElementById(
    "score"
  ).innerHTML = `<img src="./snek.png" />${score}<img src="./snek.png" />`;
  obstacles = [];
  for (let i = 0; i < score; i++) {
    gen_obstacle();
  }
  gen_apple();
}

function move_snake() {
  var head = new Pos(snake[0].x + da.x, snake[0].y + da.y);
  snake.unshift(head);
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    apple_eaten();
  } else {
    snake.pop();
  }
}

function hit_obstacle(obj) {
  // first loop for the obstacles
  for (let i = 0; i < obstacles.length; i++) {
    // second for each obstacles hitboxes
    for (let j = 0; j < obstacles[i].hitboxes.length; j++) {
      // checks through each coordinate of each 10x10 part
      if (
        obj.x === obstacles[i].hitboxes[j].x &&
        obj.y === obstacles[i].hitboxes[j].y
      ) {
        return true;
      }
    }
  }
}

function eaten_self() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  }
}

function game_end() {
  return (
    snake[0].x < 0 ||
    snake[0].x > snakeboard.width - 10 ||
    snake[0].y < 0 ||
    snake[0].y > snakeboard.height - 10 ||
    eaten_self() ||
    hit_obstacle(snake[0])
  );
}

function change_dir(evt) {
  var k = evt.keyCode;

  if ((k === 38 || k === 87) && !(da.y === 10)) {
    da = new Pos(0, -10);
  }

  if ((k === 40 || k === 83) && !(da.y === -10)) {
    da = new Pos(0, 10);
  }

  if ((k === 39 || k === 68) && !(da.x === -10)) {
    da = new Pos(10, 0);
  }

  if ((k === 37 || k === 65) && !(da.x === 10)) {
    da = new Pos(-10, 0);
  }
}

function clear() {
  snakeboard_ctx.fillStyle = "black";
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
}

function restart() {
  snake = [new Pos(100, 200), new Pos(90, 200), new Pos(80, 200)];
  apple = new Pos(snakeboard.width / 2, snakeboard.height / 2);
  da = new Pos(10, 0);
  score = 0;
  document.getElementById(
    "score"
  ).innerHTML = `<img src="./snek.png" />0<img src="./snek.png" />`;
  speed = 200;
  obstacles = [];
}

function main() {
  if (game_end()) clear(), restart();

  setTimeout(function t() {
    clear();
    draw_object("red", apple, new Pos(10, 10));
    move_snake();
    draw_snake();
    draw_obstacles();
    main();
  }, speed);
}
