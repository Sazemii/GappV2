import pool from "@/lib/db.js";

// Shared function for collecting steam data (used by cron and test endpoint)
export async function collectSteamData() {
  const response = await fetch(
    "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/"
  );
  const data = await response.json();
  const games = data.response?.ranks || [];
  const topGames = games.slice(0, 100);

  const playerData = await Promise.all(
    topGames.map(async (game) => {
      try {
        // Get current players
        const playersResponse = await fetch(
          `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${game.appid}`
        );
        const playersData = await playersResponse.json();
        const currentPlayers = playersData.response?.player_count || 0;

        // Get game name
        const detailsResponse = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
        );
        const detailsData = await detailsResponse.json();
        const gameDetails = detailsData[game.appid]?.data;
        const gameName = gameDetails?.name || `Game ${game.appid}`;

        return {
          appid: game.appid,
          name: gameName,
          players: currentPlayers,
        };
      } catch (error) {
        console.error(`Error fetching game ${game.appid}:`, error);
        return null;
      }
    })
  );

  const validData = playerData.filter((d) => d !== null);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const game of validData) {
      await client.query(
        `INSERT INTO steam_player_data (appid, game_name, player_count, timestamp)
         VALUES ($1, $2, $3, NOW())`,
        [game.appid, game.name, game.players]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database error:", error);
    throw error;
  } finally {
    client.release();
  }

  return validData;
}

export async function GET(request) {
  // Verify cron secret for production
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const validData = await collectSteamData();

    return Response.json({
      success: true,
      gamesTracked: validData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return Response.json(
      {
        error: "Failed to collect steam data",
      },
      {
        status: 500,
      }
    );
  }
}
