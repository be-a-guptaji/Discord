// app/api/servers/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageURL } = await req.json();
    const profile = await getCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileID: profile.id,
        name,
        imageURL,
        inviteCode: uuidv4(),
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

    return NextResponse.json(server);
  } catch (error) {
    console.error("Error creating server:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
