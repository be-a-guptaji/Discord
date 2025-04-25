// app/api/servers/[serverID]/invite-code/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverID: string }> }
) {
  try {
    // Get the current profile of the user
    const profile = await getCurrentProfile();

    // Check if the user is authenticated
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the server ID from the request parameters
    const { serverID } = await params;

    // Check if the server ID is provided
    if (!serverID) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    // Update the server's invite code in the database
    const server = await db.server.update({
      where: {
        id: serverID,
        profileID: profile.id,
      },
      data: {
        inviteCode: v4(),
      },
    });

    // Return the updated server data
    return NextResponse.json(server);
  } catch (error) {
    console.error("Error while creating the invitiation code:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
