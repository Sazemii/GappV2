import pool from "@/lib/db.js";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const appid = searchParams.get("appid");
  const period = searchParams.get("period") || "7d";

  if (!appid) {
    return Response.json({ error: "appid required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    let interval = "7 days";
    if (period === "30d") interval = "30 days";
    else if (period === "90d") interval = "90 days";
    else if (period === "1y") interval = "1 year";

    const result = await client.query(
      `SELECT 
        timestamp,
        player_count,
        game_name
       FROM steam_player_data
       WHERE appid = $1 
         AND timestamp >= NOW() - INTERVAL '${interval}'
       ORDER BY timestamp ASC`,
      [appid]
    );

    client.release();

    return Response.json({
      data: result.rows,
      appid: parseInt(appid),
      period,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error }, { status: 500 });
  }
}
