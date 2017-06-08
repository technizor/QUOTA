package io.technizor.quota.game;

import io.technizor.quota.player.ComputerPlayer;
import io.technizor.quota.player.HumanPlayer;
import io.technizor.quota.player.QuotaPlayer;

public final class QuotaGames {
	public static final QuotaGame getOnePlayerGame()
	{
		QuotaPlayer[] players = {new HumanPlayer(), new ComputerPlayer()};
		QuotaGame game = new QuotaGame(QuotaGame.quota_values[0], QuotaGame.quota_values[1], players);
		return game;
	}
}
