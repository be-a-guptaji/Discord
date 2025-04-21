// @/app/(main)/(routes)/page.tsx The main page of the Next.js app
import { ModeToggle } from "@/components/modeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <UserButton />
      <ModeToggle />
    </>
  );
}
