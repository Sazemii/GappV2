import pool from "@/lib/db.js";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT appid, 
        game_name, 
        player_count, 
        timestamp
       FROM (
         SELECT DISTINCT ON (appid) 
           appid, 
           game_name, 
           player_count, 
           timestamp
         FROM steam_player_data
         ORDER BY appid, timestamp DESC
       ) AS latest_data
       ORDER BY player_count DESC
       LIMIT 100`
    );

    // Fetch last 48 hours data for each game 
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
          currentPlayers: row.player_count || 0,
          peakPlayers: row.player_count || 0,
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
      { error: "Failed to fetch games", message: error.message },
      { status: 500 }
    );
  }
}
