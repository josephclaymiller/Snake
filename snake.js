(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Coord = SnakeGame.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j); 
  };
 
  var Apple = SnakeGame.Apple = function(board) {
    this.board = board;
  };

  Apple.SIGN = "A";

  Apple.prototype.replace = function() {
    // TODO: check to see there is no snake here.
    var x = Math.floor(Math.random() * this.board.size);
    var y = Math.floor(Math.random() * this.board.size);

    this.position = new Coord(x,y);
  };

  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "N";
    this.board = board;

    var center = new Coord(board.size / 2, board.size / 2);
    this.segments = [center];
  };


  Snake.DIRS = { 
    "N" : new Coord(-1, 0),
    "E" : new Coord(0, 1),
    "S" : new Coord(1, 0),
    "W" : new Coord(0, -1)
  };

  Snake.SIGN = "S";

  Snake.prototype.move = function () {
    var snake = this;
    var head = _(this.segments).last();
    var new_head = head.plus(Snake.DIRS[this.dir]);

    if (snake.eatsApple(new_head)) {
      snake.segments.push(head.plus(Snake.DIRS[this.dir]));	 
      this.board.apple.replace();
    } else if (this.board.validMove(new_head)) {
      snake.segments.push(head.plus(Snake.DIRS[this.dir]));
      snake.segments.shift();
    } else {
      snake.segments = []; 
    }
  };

  Snake.prototype.turn = function(newDir) {
    this.dir = newDir;
  };

  Snake.prototype.eatsApple = function(coord) {
    var apple_coord = this.board.apple.position;
    return (coord.i == apple_coord.i) && (coord.j == apple_coord.j);
  };

  var Board = SnakeGame.Board = function(size) {
    this.size = size;
    this.apple = new Apple(this);
    this.apple.replace();
 
    this.snake = new Snake(this);
    this.apples = [];
  };

  Board.NOSNAKE = ".";

  Board.grid = function (size) {
    return _.times(size, function() {
      return _.times(size, function() {
	return Board.NOSNAKE;
      }); 
    });
  };

  Board.prototype.validMove = function (coord) {
    var inside = (coord.i >= 0) && (coord.i <= 19) && (coord.j >= 0) && (coord.j <= 19);
    var empty = _(this.snake.segments).every(function(segment) {
      return (coord.i !== segment.i) || (coord.j !== segment.j);
    });
    return inside && empty;
  };

  Board.prototype.render = function() {
    var grid = Board.grid(this.size);

    _(this.snake.segments).each(function(segment) {
      grid[segment.i][segment.j] = Snake.SIGN;
    });
    var apple_pos = this.apple.position;
    grid[apple_pos.i][apple_pos.j] = Apple.SIGN;

    return _(grid).map(function (row) { return row.join(""); }).join("\n");

  };

})(this);
