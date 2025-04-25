// app/(setup)/page.tsx the main page of the app

import { initialProfile } from "@/lib/initialProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initialModal";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const servers = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileID: profile.id,
        },
      },
    },
  });

  if (servers) {
    return redirect(`/server/${servers.id}`);
  }

  return (
    <>
      <InitialModal />
    </>
  );
};

export default SetupPage;
