import pool from "@/lib/db.js";

export async function GET() {
  try {
    // Get the peak player count for each game from historical data
    const result = await pool.query(
      `SELECT 
        appid,
        game_name,
        MAX(player_count) as peak_players,
        (SELECT timestamp 
         FROM steam_player_data spd2 
         WHERE spd2.appid = spd1.appid 
           AND spd2.player_count = MAX(spd1.player_count)
         LIMIT 1) as peak_timestamp
       FROM steam_player_data spd1
       GROUP BY appid, game_name
       ORDER BY peak_players DESC
       LIMIT 100`
    );

    // Get last 48 hours data for each game
    const gamesWithHistory = await Promise.all(
      result.rows.map(async (row) => {
        const historyResult = await pool.query(
          `SELECT player_count, timestamp
           FROM steam_player_data
           WHERE appid = $1 
             AND timestamp >= NOW() - INTERVAL '48 hours'
           ORDER BY timestamp DESC
           LIMIT 48`,
          [row.appid]
        );

        // Reverse to get chronological order (oldest to newest)
        const historyData = historyResult.rows.reverse().map((h) => ({
          value: h.player_count || 0,
          timestamp: h.timestamp,
        }));

        return {
          appid: row.appid,
          name: row.game_name,
          peakPlayers: row.peak_players || 0,
          peakDate: row.peak_timestamp,
          last48Hours: historyData,
          headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${row.appid}/header.jpg`,
        };
      })
    );

    return Response.json({
      success: true,
      games: gamesWithHistory,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch peak records", message: error.message },
      { status: 500 }
    );
  }
}
