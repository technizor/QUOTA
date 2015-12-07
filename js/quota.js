QUOTA = (function(base, $) {
  Object.defineProperty(base, 'PLAYER', {
    value: 'player',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'STATUS', {
    value: 'status',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'ACTIVE', {
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
  Object.defineProperty(base, 'INACTIVE', {
    value: 1,
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
  const PLAYER = base.PLAYER;
  const STATUS = base.STATUS;
  const ACTIVE = base.ACTIVE;
  const BLOCKED = base.BLOCKED;
  const INACTIVE = base.INACTIVE;
  const SIZE = base.SIZE;

  var _game;

  initialize = base.initialize = function() {
    for (var i = 0; i < SIZE; i++) {
      selectRowSum(i).click(
        (function(row) {
          return function() {
            _game.printRow(row);
          };
        })(i));
      selectColSum(i).click(
        (function(col) {
          return function() {
            _game.printCol(col);
          };
        })(i));

      for (var j = 0; j < SIZE; j++) {
        for (var v = 1; v < 4; v++) {
          var cValue = selectBoardButton(i, j, v);
          cValue.click(
            (function(row, col, val) {
              return function() {
                var check = _game.move(row, col, val);
                if (check) {
                  var cPlayer = _game.currentTurn() % 2 + 1;
                  selectBoardButton(row, col, val).attr(PLAYER, cPlayer);

                  if (_game.rowDiff(row) === 0) {
                    selectRowSum(row).attr(PLAYER, cPlayer);
                  } else {
                    selectRowSum(row).attr(PLAYER, BLOCKED);
                  }
                  if (_game.colDiff(col) === 0) {
                    selectColSum(col).attr(PLAYER, cPlayer);
                  } else {
                    selectColSum(col).attr(PLAYER, BLOCKED);
                  }
                  updateBoard();
                }
              };
            })(i, j, v));
        }
      }
    }

    $('input.new-game').click((function() {
      _game.newGame();
      resetColours();
      updateBoard();
    }));
    $('input.restart-game').click((function() {
      _game.restartGame();
      resetColours();
      updateBoard();
    }));

    _game = new base.GAME(SIZE);
    resetColours();
    updateBoard();
  };
  resetColours = base.resetColours = function() {
    for (var i = 0; i < SIZE; i++) {
      selectRowSum(i).attr('player', BLOCKED);
      selectColSum(i).attr('player', BLOCKED);
      for (var j = 0; j < SIZE; j++)
        for (var v = 1; v < 4; v++)
          selectBoardButton(i, j, v).attr(PLAYER, BLOCKED);
    }
  }
  selectBoardCell = base.selectBoardCell = function(i, j) {
    return $('.cell.r-' + (i + 1) + '.c-' + (j + 1));
  };
  selectBoardButton = base.selectBoardButton = function(i, j, v) {
    return $('.cell.r-' + (i + 1) + '.c-' + (j + 1) + ' input.value.v-' + (v));
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
    selectTurnDisplay().html((_game.currentTurn() + 1));
    selectScoreDisplay(0).html(_game.score(0));
    selectScoreDisplay(1).html(_game.score(1));

    for (var i = 0; i < SIZE; i++) {
      var cRow = selectRowSum(i);
      var cCol = selectColSum(i);
      cRow.val(_game.rowTotal(i)+'/'+_game.rowSum(i));
      cCol.val(_game.colTotal(i)+'/'+_game.colSum(i));

      var rd = _game.rowDiff(i);
      var cd = _game.colDiff(i);
      var rs = _game.rowSpace(i);
      var cs = _game.colSpace(i);

      if (rd === 0) {
        cRow.attr(STATUS, INACTIVE);
      } else if (rd < 0 || rs === 0) {
        cRow.attr(STATUS, BLOCKED);
      } else {
        cRow.attr(STATUS, ACTIVE);
      }
      if (cd === 0) {
        cCol.attr(STATUS, INACTIVE);
      } else if (cd < 0 || cs === 0) {
        cCol.attr(STATUS, BLOCKED);
      } else {
        cCol.attr(STATUS, ACTIVE);
      }

      for (var j = 0; j < _game.SIZE; j++) {
        var results = _game.checkMove(i, j);
        var range = results * 3;

        var cellValue = _game.boardState(i,j);
        var cCell = selectBoardCell(i,j);
        cCell.attr(STATUS, cellValue);
      }
    }
  }
  GAME = base.GAME = function(size) {
    base = {};

    Object.defineProperty(base, 'ACTIVE', {
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
    Object.defineProperty(base, 'INACTIVE', {
      value: 1,
      writable: false,
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(base, 'SIZE', {
      value: size,
      writable: false,
      enumerable: true,
      configurable: true
    });
    const ACTIVE = base.ACTIVE;
    const BLOCKED = base.BLOCKED;
    const INACTIVE = base.INACTIVE;
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
    randomSum = base.randomSum = function(range, offset) {
      if (typeof range === 'undefined')
        range = 1;
      if (typeof offset === 'undefined')
        offset = 0;
      return Math.floor(Math.random() * range + offset);
    };
    var _board, _rowSum, _colSum, _rowTotal, _colTotal, _rowEntry, _colEntry, _turn, _scores;

    restartGame = base.restartGame = function() {
      _board = createArray(SIZE, SIZE);

      _rowTotal = createArray(SIZE);
      _colTotal = createArray(SIZE);
      _rowEntry = createArray(SIZE);
      _colEntry = createArray(SIZE);

      _turn = 0;
      _scores = createArray(2);
      _scores[0] = 0;
      _scores[1] = 0;

      for (var i = 0; i < SIZE; i++) {
        _colTotal[i] = _rowTotal[i] = _rowEntry[i] = _colEntry[i] = 0;
        for (var j = 0; j < SIZE; j++) {
          _board[i][j] = ACTIVE;
        }
      }
      validateBoard();
    }
    newGame = base.newGame = function() {
      _rowSum = createArray(SIZE);
      _colSum = createArray(SIZE);

      for (var i = 0; i < SIZE; i++) {
        _rowSum[i] = randomSum(8, 4);
        _colSum[i] = randomSum(8, 4);
      }
      restartGame();
    };

    validateBoard = base.validateBoard = function() {
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          var results = checkMove(i, j);
          var range = results * 3;
          if (_board[i][j] === ACTIVE && range === 0) {
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
        _scores[_turn % 2] += (rowDiff(row) === 0) ? _rowSum[row] : 0;
        _scores[_turn % 2] += (colDiff(col) === 0) ? _colSum[col] : 0;
        _turn++;
        validateBoard();
      }
      return check;
    };
    checkMove = base.checkMove = function(row, col) {
      var isEmpty = (_board[row][col] === ACTIVE);
      var isRowIncomplete = (rowSpace(row) > 0) && (rowDiff(row) > 0);
      var isColIncomplete = (colSpace(col) > 0) && (colDiff(col) > 0);
      return (isEmpty && isRowIncomplete && isColIncomplete);
    };

    // Accessor Methods
    rowSpace = base.rowSpace = function(row) {
      if (typeof row !== 'undefined')
        return SIZE - _rowEntry[row];
      var space = createArray(SIZE);
      for (var i = 0; i < SIZE; i++) {
        space[i] = SIZE - _rowEntry[i];
      }
      return space;
    };
    colSpace = base.colSpace = function(col) {
      if (typeof col !== 'undefined')
        return SIZE - _colEntry[col];
      var space = createArray(SIZE);
      for (var j = 0; j < SIZE; j++)
        space[j] = SIZE - _colEntry[j];
      return space;
    };

    rowDiff = base.rowDiff = function(row) {
      if (typeof row !== 'undefined')
        return _rowSum[row] - _rowTotal[row];
      var diff = createArray(SIZE);
      for (var i = 0; i < SIZE; i++)
        diff[i] = _rowSum[i] - _rowTotal[i];
      return diff;
    };
    colDiff = base.colDiff = function(col) {
      if (typeof col !== 'undefined')
        return _colSum[col] - _colTotal[col];
      var diff = createArray(SIZE);
      for (var j = 0; j < SIZE; j++)
        diff[j] = _colSum[j] - _colTotal[j];
      return diff;
    };

    boardState = base.boardState = function(row, col) {
      if (typeof row !== 'undefined' && typeof col !== 'undefined')
        return _board[row][col];
      var state = createArray(SIZE, SIZE);
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          state[i][j] = _board[i][j];
        }
      }
      return state;
    };
    currentTurn = base.currentTurn = function() {
      return _turn;
    };

    rowSum = base.rowSum = function(row) {
      if (typeof row !== 'undefined')
        return _rowSum[row];
      var sum = createArray(5);
      for (var i = 0; i < SIZE; i++)
        sum[i] = _rowSum[i];
      return sum;
    };
    colSum = base.colSum = function(col) {
      if (typeof col !== 'undefined')
        return _colSum[col];
      var sum = createArray(5);
      for (var j = 0; j < SIZE; j++)
        sum[j] = _colSum[j];
      return sum
    };
    rowTotal = base.rowTotal = function(row) {
      if (typeof row !== 'undefined')
        return _rowTotal[row];
      var total = createArray(5);
      for (var i = 0; i < SIZE; i++)
        total[i] = _rowTotal[i];
      return total;
    };
    colTotal = base.colTotal = function(col) {
      if (typeof col !== 'undefined')
        return _colTotal[col];
      var total = createArray(5);
      for (var j = 0; j < SIZE; j++)
        total[j] = _colTotal[j];
      return total;
    };
    rowEntry = base.rowEntry = function(row) {
      if (typeof row !== 'undefined')
        return _rowEntry[row];
      var entry = createArray(5);
      for (var i = 0; i < SIZE; i++)
        entry[i] = _rowEntry[i];
      return entry;
    };
    colEntry = base.colEntry = function(col) {
      if (typeof col !== 'undefined')
        return _colEntry[col];
      var entry = createArray(5);
      for (var j = 0; j < SIZE; j++)
        entry[j] = _colEntry[j];
      return entry;
    };

    score = base.score = function(playerNum) {
      if (typeof playerNum !== 'undefined')
        return _scores[playerNum];
      var scores = [_scores[0], _scores[1]];
      return scores;
    };

    printRow = base.printRow = function(row) {
      var out = 'Row ' + row + ':';
      for (var j = 0; j < SIZE; j++)
        out += ' ' + _board[row][j];
      console.log(out);
    };
    printCol = base.printCol = function(col) {
      var out = 'Col ' + col + ':';
      for (var i = 0; i < SIZE; i++)
        out += ' ' + _board[i][col];
      console.log(out);
    };

    newGame();
    return base;
  };
  $(document).ready(function() {
    QUOTA.initialize();
  });
  return base;
})(typeof QUOTA !== 'undefined' ? QUOTA : {}, $)
