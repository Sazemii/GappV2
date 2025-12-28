import { collectSteamData } from "../cron/collect-steam-data/route";

// TEST ENDPOINT
export async function POST(request) {
  try {
    console.log("Starting test data collection...");
    const validData = await collectSteamData();

    return Response.json({
      success: true,
      gamesTracked: validData.length,
      timestamp: new Date().toISOString(),
      message: "Test collection completed successfully!",
    });
  } catch (error) {
    console.error("Test collection error:", error);
    return Response.json(
      {
        error: "Failed to collect steam data",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
