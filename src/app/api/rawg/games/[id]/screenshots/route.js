import { NextResponse } from "next/server";

const RAWG_API_KEY = NEXT_PUBLIC_RAWG_API;

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const response = await fetch(
      `https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_API_KEY}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching screenshots from RAWG:", error);
    return NextResponse.json(
      { error: "Failed to fetch screenshots" },
      { status: 500 }
    );
  }
}
