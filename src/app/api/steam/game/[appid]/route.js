import pool from "@/lib/db.js";

export async function GET(request, { params }) {
  const { appid } = await params;

  if (!appid) {
    return Response.json({ error: "App ID is required" }, { status: 400 });
  }

  try {
    // Fetch app details from Steam Store API
    const storeResponse = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    const storeData = await storeResponse.json();

    if (!storeData[appid] || !storeData[appid].success) {
      return Response.json(
        { error: "Game not found on Steam" },
        { status: 404 }
      );
    }

    const gameData = storeData[appid].data;

    // Fetch current player count
    let currentPlayers = 0;
    try {
      const playerCountResponse = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
      );
      const playerCountData = await playerCountResponse.json();
      if (playerCountData.response?.result === 1) {
        currentPlayers = playerCountData.response.player_count;
      }
    } catch (err) {
      console.error("Error fetching player count:", err);
    }

    // Fetch player history from our database
    let playerHistory = [];
    let peakPlayers24h = 0;
    let allTimePeak = 0;
    try {
      // Get last 7 days of player data
      const historyResult = await pool.query(
        `SELECT player_count, timestamp
         FROM steam_player_data
         WHERE appid = $1 
           AND timestamp >= NOW() - INTERVAL '7 days'
         ORDER BY timestamp DESC`,
        [appid]
      );

      playerHistory = historyResult.rows.reverse().map((h) => ({
        value: h.player_count || 0,
        timestamp: h.timestamp,
      }));

      // Get peak from last 24 hours
      const last24hData = historyResult.rows.filter((r) => {
        const timestamp = new Date(r.timestamp);
        const now = new Date();
        return now - timestamp <= 24 * 60 * 60 * 1000;
      });
      if (last24hData.length > 0) {
        peakPlayers24h = Math.max(
          ...last24hData.map((r) => r.player_count || 0)
        );
      }

      // Get all-time peak from steam_player_data table (MAX of all records)
      const peakResult = await pool.query(
        `SELECT MAX(player_count) as peak_players FROM steam_player_data WHERE appid = $1`,
        [appid]
      );
      if (peakResult.rows.length > 0 && peakResult.rows[0].peak_players) {
        allTimePeak = peakResult.rows[0].peak_players;
      }
    } catch (err) {
      console.error("Error fetching player history:", err);
    }

    // Fetch reviews summary
    let reviewData = null;
    try {
      const reviewResponse = await fetch(
        `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all`
      );
      const reviewJson = await reviewResponse.json();
      if (reviewJson.success === 1) {
        reviewData = {
          totalPositive: reviewJson.query_summary?.total_positive || 0,
          totalNegative: reviewJson.query_summary?.total_negative || 0,
          totalReviews: reviewJson.query_summary?.total_reviews || 0,
          reviewScore: reviewJson.query_summary?.review_score || 0,
          reviewScoreDesc:
            reviewJson.query_summary?.review_score_desc || "No reviews",
        };
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }

    // Format the response
    const formattedData = {
      appid: parseInt(appid),
      name: gameData.name,
      type: gameData.type,
      isFree: gameData.is_free,
      requiredAge: gameData.required_age,
      detailedDescription: gameData.detailed_description,
      aboutTheGame: gameData.about_the_game,
      shortDescription: gameData.short_description,
      supportedLanguages: gameData.supported_languages,
      headerImage: gameData.header_image,
      capsuleImage: gameData.capsule_image,
      capsuleImageV5: gameData.capsule_imagev5,
      website: gameData.website,

      // Developer & Publisher
      developers: gameData.developers || [],
      publishers: gameData.publishers || [],

      // Pricing
      price: gameData.price_overview
        ? {
            currency: gameData.price_overview.currency,
            initial: gameData.price_overview.initial,
            final: gameData.price_overview.final,
            discountPercent: gameData.price_overview.discount_percent,
            initialFormatted: gameData.price_overview.initial_formatted,
            finalFormatted: gameData.price_overview.final_formatted,
          }
        : null,

      // Platforms
      platforms: gameData.platforms || {},

      // Metacritic
      metacritic: gameData.metacritic
        ? {
            score: gameData.metacritic.score,
            url: gameData.metacritic.url,
          }
        : null,

      // Categories (e.g., Single-player, Multi-player, Steam Achievements)
      categories: gameData.categories || [],

      // Genres
      genres: gameData.genres || [],

      // Screenshots
      screenshots: gameData.screenshots || [],

      // Movies/Trailers
      movies: gameData.movies || [],

      // Recommendations (number of recommendations)
      recommendations: gameData.recommendations?.total || 0,

      // Achievements
      achievements: gameData.achievements
        ? {
            total: gameData.achievements.total,
            highlighted: gameData.achievements.highlighted || [],
          }
        : null,

      // Release date
      releaseDate: gameData.release_date
        ? {
            comingSoon: gameData.release_date.coming_soon,
            date: gameData.release_date.date,
          }
        : null,

      // Support info
      supportInfo: gameData.support_info || {},

      // Background images
      background: gameData.background,
      backgroundRaw: gameData.background_raw,

      // Content descriptors
      contentDescriptors: gameData.content_descriptors || {},

      // PC Requirements
      pcRequirements: gameData.pc_requirements || {},
      macRequirements: gameData.mac_requirements || {},
      linuxRequirements: gameData.linux_requirements || {},

      // Legal notice
      legalNotice: gameData.legal_notice,

      // DRM notice
      drmNotice: gameData.drm_notice,

      // Ext user account notice
      extUserAccountNotice: gameData.ext_user_account_notice,

      // Player stats from our database
      playerStats: {
        currentPlayers,
        peakPlayers24h,
        allTimePeak,
        playerHistory,
      },

      // Review data
      reviews: reviewData,

      // Steam store URL
      storeUrl: `https://store.steampowered.com/app/${appid}`,
    };

    return Response.json({
      success: true,
      game: formattedData,
    });
  } catch (error) {
    console.error("Error fetching Steam game details:", error);
    return Response.json(
      { error: "Failed to fetch game details", message: error.message },
      { status: 500 }
    );
  }
}
