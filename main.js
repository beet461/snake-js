const speed = 95;

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

var score = 0;
var snake = [new Pos(100, 200), new Pos(9, 200), new Pos(80, 200)];
var apple = new Pos(snakeboard.width / 2, snakeboard.height / 2);
var da = new Pos(10, 0);

main();
document.addEventListener("keydown", change_dir);

function gen_pos() {
  return new Pos(
    Math.floor(Math.random() * 40) * 10,
    Math.floor(Math.random() * 40) * 10
  );
}

function gen_apple() {
  apple = gen_pos();
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

function move_snake() {
  var head = new Pos(snake[0].x + da.x, snake[0].y + da.y);
  snake.unshift(head);
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    console.log("H");
    score++;
    document.getElementById("score").innerHTML = score;
    gen_apple();
  } else {
    snake.pop();
  }
}

function game_end() {
  let s_copy = snake.slice(0);
  s_copy.shift();
  return (
    snake[0].x < 0 ||
    snake[0].x > snakeboard.width - 10 ||
    snake[0].y < 0 ||
    snake[0].y > snakeboard.height - 10 ||
    snake[0] in s_copy
  );
}

function change_dir(evt) {
  var k = evt.keyCode;

  if ((k === 38 || k === 87) && !(da.y === 10)) {
    da = new Pos(0, -10);
  }

  if ((k === 40 || k === 83) && !(da.y === 10)) {
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
  snake = [new Pos(100, 200), new Pos(9, 200), new Pos(80, 200)];
  apple = new Pos(snakeboard.width / 2, snakeboard.height / 2);
  da = new Pos(10, 0);
  score = 0;
}

function main() {
  if (game_end()) clear(), restart();

  setTimeout(function t() {
    clear();
    draw_object("red", apple, new Pos(10, 10));
    move_snake();
    draw_snake();
    main();
  }, speed);
}
