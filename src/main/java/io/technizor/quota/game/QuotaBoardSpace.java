package io.technizor.quota.game;

public enum QuotaBoardSpace {
	UNASSIGNED(-1), BLOCKED(0), ONE(1), TWO(2), THREE(3);

	private final int _id;

	private QuotaBoardSpace(int identifier) {
		this._id = identifier;
	}

	public int id() {
		return _id;
	}
}
