QUOTA = (function(base, $) {
  Object.defineProperty(base, 'PLAYER', {
    value: 'player',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'TURN', {
    value: 'turn',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'SCORE', {
    value: 'score',
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
  Object.defineProperty(base, 'ORDER', {
    value: 'order',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'TOTAL', {
    value: 'total',
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(base, 'SUM', {
    value: 'sum',
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
  const TURN = base.TURN;
  const SCORE = base.SCORE;
  const STATUS = base.STATUS;
  const ORDER = base.ORDER;
  const TOTAL = base.TOTAL;
  const SUM = base.SUM;
  const ACTIVE = base.ACTIVE;
  const BLOCKED = base.BLOCKED;
  const INACTIVE = base.INACTIVE;
  const SIZE = base.SIZE;

  var _game;

  initialize = base.initialize = function() {
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        for (var v = 1; v < 4; v++) {
          var cValue = selectBoardButton(i, j, v);
          cValue.click(
            (function(row, col, val) {
              return function() {
                var cPlayer = _game.currentTurn() % 2 + 1;
                var check = _game.move(row, col, val);
                if (check) {
                  selectBoardCell(row, col).attr(PLAYER, cPlayer);
                  var fRow = (_game.rowDiff(row) === 0) ? cPlayer : BLOCKED;
                  var fCol = (_game.colDiff(col) === 0) ? cPlayer : BLOCKED;
                  selectRowLabel(row).attr(PLAYER, fRow);
                  selectRowSum(row).attr(PLAYER, fRow);
                  selectColLabel(col).attr(PLAYER, fCol);
                  selectColSum(col).attr(PLAYER, fCol);
                  updateBoard();
                }
              };
            })(i, j, v));
        }
      }
    }

    $('input.config').click((function() {
      $('.game-config').addClass('active');
    }));
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
      selectRowLabel(i).attr(PLAYER, BLOCKED);
      selectColLabel(i).attr(PLAYER, BLOCKED);
      selectRowSum(i).attr(PLAYER, BLOCKED);
      selectColSum(i).attr(PLAYER, BLOCKED);
      for (var j = 0; j < SIZE; j++)
        selectBoardCell(i, j).attr(PLAYER, BLOCKED);
    }
  };

  updateBoard = base.updateBoard = function() {
    selectTurnDisplay().attr(TURN, (_game.currentTurn() + 1));
    selectScoreDisplay(0).attr(SCORE, _game.score(0));
    selectScoreDisplay(1).attr(SCORE, _game.score(1));

    for (var i = 0; i < SIZE; i++) {
      var cRow = selectRowSum(i);
      var crLabel = selectRowLabel(i);
      var cCol = selectColSum(i);
      var ccLabel = selectColLabel(i);
      cRow.attr(TOTAL, _game.rowTotal(i));
      cRow.attr(SUM, _game.rowSum(i));
      cCol.attr(TOTAL, _game.colTotal(i));
      cCol.attr(SUM, _game.colSum(i));

      var rd = _game.rowDiff(i);
      var cd = _game.colDiff(i);
      var rs = _game.rowSpace(i);
      var cs = _game.colSpace(i);

      if (rd === 0) {
        cRow.attr(STATUS, INACTIVE);
        crLabel.attr(STATUS, INACTIVE);
      } else if (rd < 0 || rs === 0) {
        cRow.attr(STATUS, BLOCKED);
        crLabel.attr(STATUS, BLOCKED);
      } else {
        cRow.attr(STATUS, ACTIVE);
        crLabel.attr(STATUS, ACTIVE);
      }
      if (cd === 0) {
        cCol.attr(STATUS, INACTIVE);
        ccLabel.attr(STATUS, INACTIVE);
      } else if (cd < 0 || cs === 0) {
        cCol.attr(STATUS, BLOCKED);
        ccLabel.attr(STATUS, BLOCKED);
      } else {
        cCol.attr(STATUS, ACTIVE);
        ccLabel.attr(STATUS, ACTIVE);
      }

      for (var j = 0; j < _game.SIZE; j++) {
        var cCell = selectBoardCell(i, j);
        cCell.attr(STATUS, _game.boardState(i, j));
        cCell.attr(ORDER, (_game.moveOrder(i, j) + 1));
      }
    }
  };

  selectBoardCell = base.selectBoardCell = function(i, j) {
    return $('.game-board .cell.r-' + (i + 1) + '.c-' + (j + 1));
  };
  selectBoardButton = base.selectBoardButton = function(i, j, v) {
    return $('.game-board .cell.r-' + (i + 1) + '.c-' + (j + 1) + ' input.value.v-' + (v));
  };
  selectRowLabel = base.selectRowLabel = function(i) {
    return $('.game-board .label.r-' + (i + 1));
  };
  selectColLabel = base.selectColLabel = function(j) {
    return $('.game-board .label.c-' + (j + 1));
  };
  selectRowSum = base.selectRowSum = function(i) {
    return $('.game-board .sum.r-' + (i + 1));
  };
  selectColSum = base.selectColSum = function(j) {
    return $('.game-board .sum.c-' + (j + 1));
  };

  selectTurnDisplay = base.selectTurnDisplay = function() {
    return $('.game-control .display.turn');
  }
  selectScoreDisplay = base.selectScoreDisplay = function(p) {
    return $('.game-control .display.score.p-' + (p + 1));
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
    var _board, _rowSum, _colSum, _rowTotal, _colTotal, _rowEntry, _colEntry;
    var _turn, _scores, _moveHistory, _moveOrder;

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
      _moveHistory = createArray(SIZE * SIZE, 3);
      _moveOrder = createArray(SIZE, SIZE);

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

    // Game Actions
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
        _moveHistory[_turn][0] = row;
        _moveHistory[_turn][1] = col;
        _moveHistory[_turn][2] = val;
        _moveOrder[row][col] = _turn;
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
    moveHistory = base.moveHistory = function(turn) {
      if (typeof turn !== 'undefined') {
        var moveAction = [_moveHistory[turn][0], _moveHistory[turn][1], _moveHistory[turn][2]];
        return _moveAction;
      }
      var moveList = createArray(SIZE * SIZE, 3);
      for (var t = 0; t < SIZE * SIZE; t++) {
        moveList[t][0] = _moveHistory[t][0];
        moveList[t][1] = _moveHistory[t][1];
        moveList[t][2] = _moveHistory[t][2];
      }
      return moveList;
    };
    moveOrder = base.moveOrder = function(row, col) {
      if (typeof row !== 'undefined' && typeof col !== 'undefined') {
        return _moveOrder[row][col];
      }
      var boardOrder = createArray(SIZE, SIZE);
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++)
          boardOrder[i][j] = _moveOrder[i][j];
      }
      return boardOrder;
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
      return sum;
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

    newGame();
    return base;
  };
  $(document).ready(function() {
    QUOTA.initialize();
  });
  return base;
})(typeof QUOTA !== 'undefined' ? QUOTA : {}, $)
