(function(root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});
  
  var BOARD_SIZE = 20;

  var View = SnakeGame.View = function(element) {
    this.$el = element;

    this.board = null;
    this.intv = null;
  };

  View.validKeyCodes = {
    38: "N",
    40: "S",
    37: "W",
    39: "E"
  };

  View.STEP_INTERVAL = 100; // Time per step

  View.prototype.handleKeyEvent = function(event) {
    var view = this;
    var board = view.board;
    if (_(View.validKeyCodes).has(event.keyCode)) {
      var direction = View.validKeyCodes[event.keyCode];
      this.board.snake.turn(direction);
    }
  };
  
  View.prototype.buildGrid = function(size) {
    return _.times(size, function(){
      return _.times(size, function(){
        return $('<div class="cell"></div>');
      }); 
    });
  };

  View.prototype.render = function() {
    var view = this;
    var board = view.board;
    // build empty grid for board
    var cellGrid = this.buildGrid(board.size);
    // add snake to grid
    // if (board.snake.active) {
      _(board.snake.segments).each(function(seg) {
        cellGrid[seg.row][seg.col].addClass("snake");
      });
      var snake_head = _(board.snake.segments).last();
      cellGrid[snake_head.row][snake_head.col].addClass("snake_head");
      // turn snake head in direction
      cellGrid[snake_head.row][snake_head.col].addClass(board.snake.dir);
    // }
    // add apple to grid
    cellGrid[board.apple.position.row][board.apple.position.col].addClass("apple");
    // remove last board
    this.$el.empty(); 
    // add current board
    _(cellGrid).each(function(row) {
      var $rowEl = $('<div class="row"></div>');
      _(row).each(function($cell) { 
        $rowEl.append($cell);
      });
      view.$el.append($rowEl);
    });
  };

  View.prototype.step = function() {
    if (this.board.snake.active) {
      this.board.snake.move();
      this.render();
    } else { 
      console.log("Game Over");
      alert("Game Over"); // pop up to inform the player the game has ended
      window.clearInterval(this.intv); // cancel step interval action 
    }
  };

  View.prototype.start = function() {
    this.board = new SnakeGame.Board(BOARD_SIZE);

    $(window).keydown(this.handleKeyEvent.bind(this));

    this.intv = window.setInterval(
      this.step.bind(this),
      View.STEP_INTERVAL
    ); 
  };

  View.prototype.bindKeyEvents = function() {
    $(window).on('keydown', function(e) {
      handleKeyEvent(e);
    });
  };

})(this);
