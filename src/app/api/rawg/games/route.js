import { NextResponse } from "next/server";

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward all query parameters to RAWG API
    const params = new URLSearchParams();
    params.append("key", RAWG_API_KEY);

    // Copy all search params from the request
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const response = await fetch(
      `https://api.rawg.io/api/games?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching games from RAWG:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
