// app/api/servers/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { v4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
  try {
    // Parse the request body to get the server name and image URL
    const { name, imageURL } = await req.json();

    // Get the current profile of the user
    const profile = await getCurrentProfile();

    // Check if the user is authenticated
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new server in the database
    const server = await db.server.create({
      data: {
        profileID: profile.id,
        name,
        imageURL,
        inviteCode: v4(),
        channels: {
          create: [{ name: "general", profileID: profile.id }],
        },
        members: {
          create: {
            profileID: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    // Return the created server data
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error creating server:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
