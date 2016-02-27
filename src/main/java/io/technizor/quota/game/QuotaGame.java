package io.technizor.quota.game;

import io.technizor.quota.player.QuotaPlayer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class QuotaGame {
	public static final int[][] quota_values = { { 5, 6, 8, 10, 11 },
			{ 4, 7, 8, 9, 12 } };

	private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

	private final QuotaBoardSpace[][] boardState;
	private final int[] colMoves;
	private final int[] colQuotas;
	private final int[] colTotals;
	private final ArrayList<QuotaMove> moves;
	private final int numCols;
	private final int numPlayers;
	private final int numRows;
	private final int[] playerPoints;
	private final QuotaPlayer[] players;
	private int pointsAvailable;
	private final int[] rowMoves;
	private final int[] rowQuotas;
	private final int[] rowTotals;
	private int spacesSet;

	public QuotaGame(int[] rowQuotas, int[] colQuotas, QuotaPlayer[] players) {
		this.numRows = rowQuotas.length;
		this.numCols = colQuotas.length;
		this.numPlayers = players.length;

		this.moves = new ArrayList<>();
		this.boardState = new QuotaBoardSpace[numRows][numCols];
		Arrays.fill(this.boardState, QuotaBoardSpace.UNASSIGNED);

		this.rowQuotas = Arrays.copyOf(rowQuotas, numRows);
		this.colQuotas = Arrays.copyOf(colQuotas, numCols);
		this.rowTotals = new int[numRows];
		this.colTotals = new int[numCols];
		this.rowMoves = new int[numRows];
		this.colMoves = new int[numCols];

		this.players = Arrays.copyOf(players, numPlayers);
		this.playerPoints = new int[numPlayers];

		this.spacesSet = 0;
		this.pointsAvailable = 0;
		for (int row = 0; row < numRows; row++) {
			pointsAvailable += this.rowQuotas[row];
		}
		for (int col = 0; col < numCols; col++) {
			pointsAvailable += this.colQuotas[col];
		}
	}

	public int getColQuota(int col) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return colQuotas[col];
		} finally {
			lock.unlock();
		}
	}

	public int getColSpacesRemaining(int col) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return numCols - colMoves[col];
		} finally {
			lock.unlock();
		}
	}

	public int getColTotal(int col) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return colTotals[col];
		} finally {
			lock.unlock();
		}
	}

	public ArrayList<QuotaMove> getMoves() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return new ArrayList<>(moves);
		} finally {
			lock.unlock();
		}
	}

	public int getMovesPlayed() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return moves.size();
		} finally {
			lock.unlock();
		}
	}

	public int getRowQuota(int row) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return rowQuotas[row];
		} finally {
			lock.unlock();
		}
	}

	public int getRowSpacesRemaining(int row) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return numRows - rowMoves[row];
		} finally {
			lock.unlock();
		}
	}

	public int getRowTotal(int row) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return rowTotals[row];
		} finally {
			lock.unlock();
		}
	}

	public int getSpacesRemaining() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return (numRows * numCols) - spacesSet;
		} finally {
			lock.unlock();
		}
	}

	public QuotaBoardSpace[][] getState() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			QuotaBoardSpace[][] copy = new QuotaBoardSpace[numRows][numCols];
			for (int row = 0; row < numRows; row++) {
				for (int col = 0; col < numCols; col++) {
					copy[row][col] = boardState[row][col];
				}
			}
			return copy;
		} finally {
			lock.unlock();
		}
	}

	public QuotaBoardSpace getState(int row, int col) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return boardState[row][col];
		} finally {
			lock.unlock();
		}
	}

	public boolean isColEnded(int col) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return (colTotals[col] >= colQuotas[col] || colMoves[col] == numCols);
		} finally {
			lock.unlock();
		}
	}

	public boolean isGameEnded() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return spacesSet == (numRows * numCols);
		} finally {
			lock.unlock();
		}
	}

	public boolean isRowEnded(int row) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return (rowTotals[row] >= rowQuotas[row] || rowMoves[row] == numRows);
		} finally {
			lock.unlock();
		}
	}

	public boolean nextMove() {
		if (spacesSet == (numRows * numCols))
			return false;
		QuotaMove move = players[moves.size() % 2].getMove(this);
		return this.play(move);
	}

	private boolean play(QuotaMove move) {
		if (move == null) {
			return false;
		}
		final int row = move.getRow();
		final int col = move.getCol();
		QuotaBoardSpace value = move.getValue();
		switch (value) {
		case UNASSIGNED:
		case BLOCKED:
			return false;
		case ONE:
		case TWO:
		case THREE:
			break;
		}

		Lock lock = rwLock.writeLock();
		lock.lock();
		try {
			switch (boardState[row][col]) {
			case UNASSIGNED:
				break;
			case BLOCKED:
			case ONE:
			case TWO:
			case THREE:
				return false;
			}
			boardState[row][col] = value;
			rowTotals[row] += value.id();
			rowMoves[row]++;
			colTotals[col] += value.id();
			colMoves[col]++;
			spacesSet++;
			int pointsScored = 0;
			pointsScored += validateRow(row);
			pointsScored += validateCol(col);

			playerPoints[moves.size() % 2] += pointsScored;
			moves.add(new QuotaMove(move));
			return true;
		} finally {
			lock.unlock();
		}
	}

	private int validateRow(int row) {
		int pointsScored = 0;
		if (rowTotals[row] >= rowQuotas[row]) {
			if (rowTotals[row] == rowQuotas[row]) {
				pointsScored = rowQuotas[row];
			}
			pointsAvailable -= rowQuotas[row];
			for (int col = 0; col < numCols; col++) {
				switch (boardState[row][col]) {
				case UNASSIGNED:
					boardState[row][col] = QuotaBoardSpace.BLOCKED;
					rowMoves[row]++;
					colMoves[col]++;
					spacesSet++;
					break;
				case BLOCKED:
				case ONE:
				case TWO:
				case THREE:
					break;
				}
			}
		} else if (rowMoves[row] == numRows) {
			pointsAvailable -= rowQuotas[row];
		}
		return pointsScored;
	}

	private int validateCol(int col) {
		int pointsScored = 0;
		if (colTotals[col] >= colQuotas[col]) {
			if (colTotals[col] == colQuotas[col]) {
				pointsScored += colQuotas[col];
			}
			pointsAvailable -= colQuotas[col];
			for (int row = 0; row < numRows; row++) {
				switch (boardState[row][col]) {
				case UNASSIGNED:
					boardState[row][col] = QuotaBoardSpace.BLOCKED;
					rowMoves[row]++;
					colMoves[col]++;
					spacesSet++;
					break;
				case BLOCKED:
				case ONE:
				case TWO:
				case THREE:
					break;
				}
			}
		} else if (colMoves[col] == numCols) {
			pointsAvailable -= colQuotas[col];
		}
		return pointsScored;
	}

	public int[] playerPoints() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return Arrays.copyOf(playerPoints, playerPoints.length);
		} finally {
			lock.unlock();
		}
	}

	public int playerPoints(int player) {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return playerPoints[player];
		} finally {
			lock.unlock();
		}
	}

	public int pointsAvailable() {
		Lock lock = rwLock.readLock();
		lock.lock();
		try {
			return pointsAvailable;
		} finally {
			lock.unlock();
		}
	}
}
