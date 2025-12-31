/**
 * Studio Settings API
 * 
 * Handles user preferences for studio tools.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import {
  getUserPreferences,
  updateUserPreferences,
  updateToolDefaults,
} from "@/lib/studios/userPreferences";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = getUserPreferences(session.user.id);
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error fetching studio preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { updates, toolId, toolDefaults } = body;

    let preferences;
    if (toolId && toolDefaults) {
      preferences = updateToolDefaults(session.user.id, toolId, toolDefaults);
    } else if (updates) {
      preferences = updateUserPreferences(session.user.id, updates);
    } else {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error updating studio preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
