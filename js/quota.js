QUOTA = (function(base, $) {
  var _game;
  initialize = base.initialize = function() {
    if (!_game)
      _game = new base.GAME();
    else
      _game.newGame();

    for (var i = 0; i < _game.SIZE; i++) {
      var cRow = selectRowSum(i);
      var cCol = selectColSum(i);
      cRow.click(
        (function(row) {
          return function() {
            _game.printRow(row);
          };
        })(i));
      cCol.click(
        (function(col) {
          return function() {
            _game.printCol(col);
          };
        })(i));

      for (var j = 0; j < _game.SIZE; j++) {
        for (var v = 1; v < 4; v++) {
          var cValue = selectBoardButton(i, j, v);
          cValue.click(
            (function(row, col, val) {
              return function() {
                var check = _game.move(row, col, val);
                if (check) {
                  var cValue = selectBoardButton(row, col, val);
                  var cRow = selectRowSum(row);
                  var cCol = selectColSum(col);
                  var cPlayer = _game.currentTurn() % 2 + 1;
                  cValue.attr('player', cPlayer);

                  var rd = _game.rowDiff(row);
                  var cd = _game.colDiff(col);
                  var rs = _game.rowSpace(row);
                  var cs = _game.colSpace(col);

                  if (rd === 0) {
                    cRow.attr('player', cPlayer);
                  } else if (rd < 0 || rs === 0) {
                    cRow.attr('player', 0);
                  } else {
                    cRow.attr('player', _game.EMPTY);
                  }
                  if (cd === 0) {
                    cCol.attr('player', cPlayer);
                  } else if (cd < 0 || cs === 0) {
                    cCol.attr('player', 0);
                  } else {
                    cCol.attr('player', _game.EMPTY);
                  }
                  updateBoard();
                }
              };
            })(i, j, v));
        }
      }
    }
    updateBoard();
  };
  selectBoardButton = base.selectBoardButton = function(i, j, v) {
    return $('input.value.r-' + (i + 1) + '.c-' + (j + 1) + '.v-' + (v));
  };
  selectRowSum = base.selectRowSum = function(i) {
    return $('input.sum.r-' + (i + 1));
  };
  selectColSum = base.selectColSum = function(j) {
    return $('input.sum.c-' + (j + 1));
  };

  selectTurnDisplay = base.selectTurnDisplay = function() {
    return $('span.display.turn');
  }
  selectScoreDisplay = base.selectScoreDisplay = function(p) {
    return $('span.display.score.p-' + (p + 1));
  }

  updateBoard = base.updateBoard = function() {
    var turnDisplay = selectTurnDisplay();
    var p1Score = selectScoreDisplay(0);
    var p2Score = selectScoreDisplay(1);
    turnDisplay.html((_game.currentTurn()+1));
    p1Score.html(_game.score(0));
    p2Score.html(_game.score(1));
    for (var i = 0; i < 5; i++) {
      var cRow = selectRowSum(i);
      var cCol = selectColSum(j);
      cRow.val(_game.rowSum(i));
      cCol.val(_game.colSum(i));
      for (var j = 0; j < 5; j++) {
        var results = _game.checkMove(i, j);
        var range = results * 3;
        for (var v = 1; v <= 3; v++) {
          var cValue = selectBoardButton(i, j, v);
          var entryValue = _game.boardState(i, j);
          if (entryValue === _game.EMPTY) {
            cValue.attr('status', range);
          } else if (entryValue !== v) {
            cValue.attr('status', '0');
          } else {
            cValue.attr('status', _game.EMPTY);
          }
        }
      }
    }
  }
  GAME = base.GAME = function(base) {
    if (typeof base === 'undefined')
      base = {};

    Object.defineProperty(base, 'EMPTY', {
      value: -1,
      writable: false,
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(base, 'BLOCKED', {
      value: 0,
      writable: false,
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(base, 'SIZE', {
      value: 5,
      writable: false,
      enumerable: true,
      configurable: true
    });
    const EMPTY = base.EMPTY;
    const BLOCKED = base.BLOCKED;
    const SIZE = base.SIZE;

    createArray = base.createArray = function(length) {
      var arr = new Array(length || 0),
        i = length;
      if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
      }
      return arr;
    };
    randomSum = base.randomSum = function() {
      return Math.floor(Math.random() * 8 + 4);
    };
    var _board, _rowSum, _colSum, _rowTotal, _colTotal, _rowEntry, _colEntry, _turn, _scores;

    newGame = base.newGame = function() {
      _board = createArray(SIZE, SIZE);

      _rowSum = createArray(SIZE);
      _colSum = createArray(SIZE);
      _rowTotal = createArray(SIZE);
      _colTotal = createArray(SIZE);
      _rowEntry = createArray(SIZE);
      _colEntry = createArray(SIZE);

      _turn = 0;
      _scores = createArray(2);
      _scores[0] = 0;
      _scores[1] = 0;

      for (var i = 0; i < SIZE; i++) {
        _rowSum[i] = randomSum();
        _colSum[i] = randomSum();
        _colTotal[i] = _rowTotal[i] = _rowEntry[i] = _colEntry[i] = 0;
        for (var j = 0; j < SIZE; j++) {
          _board[i][j] = EMPTY;
        }
      }
      validateBoard();
    };

    validateBoard = base.validateBoard = function() {
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          var results = checkMove(i, j);
          var range = results * 3;
          if (_board[i][j] === EMPTY && range === 0) {
            _board[i][j] = 0;
            _rowEntry[i]++;
            _colEntry[j]++;
          }
        }
      }
    };

    // Mutators
    move = base.move = function(row, col, val) {
      var check = checkMove(row, col);
      if (check) {
        _board[row][col] = val;
        _rowTotal[row] += val;
        _colTotal[col] += val;
        _rowEntry[row]++;
        _colEntry[col]++;
        _scores[base.turn % 2] += (rowDiff(row) === 0) ? _rowSum[row] : 0;
        _scores[base.turn % 2] += (colDiff(col) === 0) ? _colSum[col] : 0;
        _turn++;
        validateBoard();
      }
      return check;
    };
    checkMove = base.checkMove = function(row, col) {
      var isEmpty = (_board[row][col] === EMPTY);
      var isRowIncomplete = (rowSpace(row) > 0) && (rowDiff(row) > 0);
      var isColIncomplete = (colSpace(col) > 0) && (colDiff(col) > 0);
      return (isEmpty && isRowIncomplete && isColIncomplete);
    };

    // Accessor Methods
    rowSpace = base.rowSpace = function(i) {
      if (typeof i !== 'undefined')
        return SIZE - _rowEntry[i];
      var space = createArray(SIZE);
      for (i = 0; i < SIZE; i++) {
        space[i] = SIZE - _rowEntry[i];
      }
      return space;
    };
    colSpace = base.colSpace = function(j) {
      if (typeof j !== 'undefined')
        return SIZE - _colEntry[j];
      var space = createArray(SIZE);
      for (j = 0; j < SIZE; j++)
        space[j] = SIZE - _colEntry[j];
      return space;
    };

    rowDiff = base.rowDiff = function(i) {
      if (typeof i !== 'undefined')
        return _rowSum[i] - _rowTotal[i];
      var diff = createArray(SIZE);
      for (i = 0; i < SIZE; i++)
        diff[i] = _rowSum[i] - _rowTotal[i];
      return diff;
    };
    colDiff = base.colDiff = function(j) {
      if (typeof j !== 'undefined')
        return _colSum[j] - _colTotal[j];
      var diff = createArray(SIZE);
      for (j = 0; j < SIZE; j++)
        diff[j] = _colSum[j] - _colTotal[j];
      return diff;
    };

    boardState = base.boardState = function(i, j) {
      if (typeof i !== 'undefined' && typeof j !== 'undefined')
        return _board[i][j];
      var state = createArray(SIZE, SIZE);
      for (i = 0; i < SIZE; i++) {
        for (j = 0; j < SIZE; j++) {
          state[i][j] = _board[i][j];
        }
      }
      return state;
    };
    currentTurn = base.currentTurn = function() {
      return _turn;
    };

    rowSum = base.rowSum = function(i) {
      return _rowSum[i];
    };
    colSum = base.colSum = function(j) {
      return _colSum[j];
    };
    rowTotal = base.rowTotal = function(i) {
      return _rowTotal[i];
    };
    colTotal = base.colTotal = function(j) {
      return _colTotal[j];
    };

    score = base.score = function(p) {
      return _scores[p];
    };

    printRow = base.printRow = function(i) {
      var out = 'Row ' + i + ':';
      for (var j = 0; j < SIZE; j++)
        out += ' ' + _board[i][j];
      console.log(out);
    };
    printCol = base.printCol = function(j) {
      var out = 'Col ' + j + ':';
      for (var i = 0; i < SIZE; i++)
        out += ' ' + _board[i][j];
      console.log(out);
    };

    base.newGame();
    return base;
  };
  $(document).ready(function() {
    QUOTA.initialize();
  });
  return base;
})(typeof QUOTA !== 'undefined' ? QUOTA : {}, $)
