// types.ts

import { Member, Profile, Server } from "@/lib/generated/prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
