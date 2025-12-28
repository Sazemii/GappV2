export async function GET() {
  try {
    const response = await fetch(
      "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/",
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Steam data");
    }

    const data = await response.json();
    const games = data.response?.ranks || [];

    // Get top 10 games
    const top10 = games.slice(0, 10);

    // Fetch game details for each game to get names and images
    const gamesWithDetails = await Promise.all(
      top10.map(async (game) => {
        try {
          const detailsResponse = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
          );
          const detailsData = await detailsResponse.json();
          const gameDetails = detailsData[game.appid]?.data;

          // Get current players amount
          const playersResponse = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${game.appid}`
          );
          const playersData = await playersResponse.json();
          const currentPlayers = playersData.response?.player_count || 0;

          return {
            appid: game.appid,
            name: gameDetails?.name || `Game ${game.appid}`,
            currentPlayers: currentPlayers || 0,
            peakPlayers: game.peak_in_game || 0,
            last30Days:
              game.last_month_concurrent || game.concurrent_in_game || 0,
            hoursPlayed: Math.round(
              ((game.concurrent_in_game || 0) * 24 * 30) / 1000
            ), // Estimated
            headerImage: gameDetails?.header_image || null,
          };
        } catch (error) {
          return {
            appid: game.appid,
            name: `Game ${game.appid}`,
            currentPlayers: game.concurrent_in_game || 0,
            peakPlayers: game.peak_in_game || 0,
            last30Days:
              game.last_month_concurrent || game.concurrent_in_game || 0,
            hoursPlayed: Math.round(
              ((game.concurrent_in_game || 0) * 24 * 30) / 1000
            ),
            headerImage: null,
          };
        }
      })
    );

    return Response.json({ games: gamesWithDetails });
  } catch (error) {
    console.error("Steam API Error:", error);
    return Response.json(
      { error: "Failed to fetch games data" },
      { status: 500 }
    );
  }
}
