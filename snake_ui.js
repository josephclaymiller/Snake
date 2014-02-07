(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var View = SnakeGame.View = function (element) {
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

  View.STEPS = 100;

  View.prototype.handleKeyEvent = function (event) {
    if (_(View.validKeyCodes).has(event.keyCode)) {
      this.board.snake.turn(View.validKeyCodes[event.keyCode]);
    } else {

    }
  };

  View.prototype.render = function () {
    var view = this;
    var board = view.board;
    
    function buildGrid() {
      return _.times(board.size, function(){
        return _.times(board.size, function(){
          return $('<div class="cell"></div>');
        }); 
      });
    }

    var cellGrid = buildGrid();
    _(board.snake.segments).each(function (seg) {
      cellGrid[seg.i][seg.j].addClass("snake");
    });
    // debugger
    cellGrid[board.apple.position.i][board.apple.position.j].addClass("apple");

    this.$el.empty();
    _(cellGrid).each(function (row) {
      var $rowEl = $('<div class="row"></div>');
      _(row).each(function ($cell) { $rowEl.append($cell) });
      view.$el.append($rowEl);
    });
  };
  

  View.prototype.step = function () {
    if (_(this.board.snake.segments).last()) {
      this.board.snake.move();
      this.render();
    } else { 
      alert("You lose");
      window.clearInterval(this.intv); // cancel step interval action 
      document.location.reload(true); // reload window
    }
  };

  View.prototype.start = function() {
    this.board = new SnakeGame.Board(20);

    $(window).keydown(this.handleKeyEvent.bind(this));

    this.intv = window.setInterval(
      this.step.bind(this),
      View.STEPS
    ); 
  };

  View.prototype.bindKeyEvents = function () {
    $(window).on('keydown', function(e) {
      handleKeyEvent(e);
    });
  };

})(this);
