package io.technizor.quota.game;

public class QuotaMove {
	private final int row;
	private final int col;
	private final QuotaBoardSpace value;

	public QuotaMove(int row, int col, QuotaBoardSpace value) {
		this.row = row;
		this.col = col;
		this.value = value;
	}

	public QuotaMove(QuotaMove original) {
		this.row = original.row;
		this.col = original.col;
		this.value = original.value;
	}

	public int getRow() {
		return this.row;
	}

	public int getCol() {
		return this.col;
	}

	public QuotaBoardSpace getValue() {
		return this.value;
	}

	public boolean equals(Object obj) {
		if (obj == null)
			return false;
		if (obj instanceof QuotaMove) {
			QuotaMove other = (QuotaMove) obj;
			return this.row == other.row && this.col == other.col
					&& this.value.equals(other.value);
		}
		return false;
	}
}
