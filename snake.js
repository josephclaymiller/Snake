(function(root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Coord = SnakeGame.Coord = function(i, j) {
    this.i = i;
    this.j = j;
  };

  Coord.prototype.plus = function(coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j); 
  };
 
  var Apple = SnakeGame.Apple = function(board) {
    this.board = board;
    this.SYMBOL = "A";
  };

  Apple.prototype.place = function() {
    var x = Math.floor(Math.random() * this.board.size);
    var y = Math.floor(Math.random() * this.board.size);
    
    this.position = new Coord(x,y);
    
    // check to see there is no snake here
    if (this.board.snake.is_segment(x,y)) {
      this.place(); // try placing apple again if on snake segment
    }
  };

  var Snake = SnakeGame.Snake = function(board) {
    this.dir = "N";
    this.board = board;
    this.SYMBOL = "S";

    var center = new Coord(board.size / 2, board.size / 2);
    this.segments = [center];
  };

  Snake.DIRS = { 
    "N" : new Coord(-1, 0),
    "E" : new Coord(0, 1),
    "S" : new Coord(1, 0),
    "W" : new Coord(0, -1)
  };
  
  Snake.prototype.is_segment = function(x, y) {
    return _(this.segments).any(function(segment) {
      return (x === segment.i) && (y === segment.j);
    });
  };
  
  Snake.prototype.not_segment = function(x, y) {
    return _(this.segments).every(function(segment) {
      return (x !== segment.i) || (y !== segment.j);
    });
  };
  
  Snake.prototype.move = function() {
    var snake = this;
    var head = _(this.segments).last();
    var new_head = head.plus(Snake.DIRS[this.dir]);
    // add snake segment in direction snake is moving
    if (snake.eatsApple(new_head)) {
      snake.segments.push(head.plus(Snake.DIRS[this.dir]));	 
      this.board.apple.place();
    } else if (this.board.validMove(new_head)) {
      snake.segments.push(head.plus(Snake.DIRS[this.dir]));
      snake.segments.shift(); // remove oldest segment if no apple eaten
    } else {
      snake.segments = []; // remove snake if invalid move
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
 
    this.snake = new Snake(this);
    
    this.apple = new Apple(this);
    this.apple.place();
    this.apples = [];
  };

  Board.grid = function(size) {
    return _.times(size, function() {
      return _.times(size, function() {
      	return null; //empty board space;
      }); 
    });
  };

  Board.prototype.validMove = function(coord) {
    var inbounds = (coord.i >= 0) &&
                 (coord.i < this.size) &&
                 (coord.j >= 0) &&
                 (coord.j < this.size);
    var not_snake = this.snake.not_segment(coord.i, coord.j);
    return inbounds && not_snake;
  };

  Board.prototype.render = function() {
    var grid = Board.grid(this.size);
    // render snake
    _(this.snake.segments).each(function(segment) {
      grid[segment.i][segment.j] = Snake.SYMBOL;
    });
    // render apple
    var apple_pos = this.apple.position;
    grid[apple_pos.i][apple_pos.j] = Apple.SYMBOL;

    return _(grid).map(function(row) { 
      return row.join(""); 
    }).join("\n");
  };

})(this);
