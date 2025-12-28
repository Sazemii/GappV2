import pool from "@/lib/db.js";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (appid) 
        appid, 
        game_name, 
        player_count, 
        timestamp
       FROM steam_player_data
       ORDER BY appid, timestamp DESC
       LIMIT 100`
    );

    // Transform the data to match component expectations
    const games = result.rows.map((row) => ({
      appid: row.appid,
      name: row.game_name,
      currentPlayers: row.player_count || 0,
      peakPlayers: row.player_count || 0, // You'll need to track this separately
      last30Days: row.player_count || 0,
      hoursPlayed: 0, // You'll need to calculate this
      headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${row.appid}/header.jpg`,
    }));

    return Response.json({
      success: true,
      games: games,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch games", message: error.message },
      { status: 500 }
    );
  }
}
