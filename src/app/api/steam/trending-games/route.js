import pool from "@/lib/db.js";

export async function GET() {
  try {
    // Get current top games
    const currentResult = await pool.query(
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

    // For each game, get the player count from 24 hours ago
    const gamesWithChange = await Promise.all(
      currentResult.rows.map(async (row) => {
        // Get data from 24 hours ago (closest to 24h ago)
        const pastResult = await pool.query(
          `SELECT player_count, timestamp
           FROM steam_player_data
           WHERE appid = $1 
             AND timestamp >= NOW() - INTERVAL '25 hours'
             AND timestamp <= NOW() - INTERVAL '23 hours'
           ORDER BY ABS(EXTRACT(EPOCH FROM (timestamp - (NOW() - INTERVAL '24 hours'))))
           LIMIT 1`,
          [row.appid]
        );

        // If no data from exactly 24h ago, try to get the oldest data in last 48h
        let pastPlayerCount = 0;
        if (pastResult.rows.length === 0) {
          const fallbackResult = await pool.query(
            `SELECT player_count, timestamp
             FROM steam_player_data
             WHERE appid = $1 
               AND timestamp >= NOW() - INTERVAL '48 hours'
             ORDER BY timestamp ASC
             LIMIT 1`,
            [row.appid]
          );
          if (fallbackResult.rows.length > 0) {
            pastPlayerCount = fallbackResult.rows[0].player_count || 0;
          }
        } else {
          pastPlayerCount = pastResult.rows[0].player_count || 0;
        }

        const currentPlayers = row.player_count || 0;
        const change = currentPlayers - pastPlayerCount;
        const changePercent = pastPlayerCount > 0 
          ? ((change / pastPlayerCount) * 100).toFixed(1)
          : pastPlayerCount === 0 && currentPlayers > 0 ? 100 : 0;

        // Get last 48 hours data for chart
        const historyResult = await pool.query(
          `SELECT player_count, timestamp
           FROM steam_player_data
           WHERE appid = $1 
             AND timestamp >= NOW() - INTERVAL '48 hours'
           ORDER BY timestamp DESC
           LIMIT 48`,
          [row.appid]
        );

        const historyData = historyResult.rows.reverse().map((h) => ({
          value: h.player_count || 0,
          timestamp: h.timestamp,
        }));

        return {
          appid: row.appid,
          name: row.game_name,
          currentPlayers: currentPlayers,
          pastPlayers: pastPlayerCount,
          change: change,
          changePercent: parseFloat(changePercent),
          last48Hours: historyData,
          headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${row.appid}/header.jpg`,
        };
      })
    );

    // Filter out games with no meaningful change and sort by absolute change percentage
    const trendingGames = gamesWithChange
      .filter((game) => game.pastPlayers > 0 || game.currentPlayers > 0)
      .sort((a, b) => {
        // Sort by absolute change percentage, prioritizing increases
        const aScore = a.changePercent > 0 ? a.changePercent * 1.5 : Math.abs(a.changePercent);
        const bScore = b.changePercent > 0 ? b.changePercent * 1.5 : Math.abs(b.changePercent);
        return bScore - aScore;
      })
      .slice(0, 100);

    return Response.json({
      success: true,
      games: trendingGames,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch trending games", message: error.message },
      { status: 500 }
    );
  }
}

