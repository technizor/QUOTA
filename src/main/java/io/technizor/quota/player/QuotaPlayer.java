package io.technizor.quota.player;

import io.technizor.quota.game.QuotaGame;
import io.technizor.quota.game.QuotaMove;

public interface QuotaPlayer {
	public QuotaMove getMove(QuotaGame board);
}
