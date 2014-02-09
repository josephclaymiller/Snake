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
    if (_(View.validKeyCodes).has(event.keyCode)) {
      this.board.snake.turn(View.validKeyCodes[event.keyCode]);
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
    _(board.snake.segments).each(function(seg) {
      cellGrid[seg.i][seg.j].addClass("snake");
    });
    // add apple to grid
    cellGrid[board.apple.position.i][board.apple.position.j].addClass("apple");
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
    if (_(this.board.snake.segments).last()) {
      this.board.snake.move();
      this.render();
    } else { 
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
