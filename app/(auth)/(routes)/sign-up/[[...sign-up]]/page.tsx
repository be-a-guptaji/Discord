// app/(auth)/(routes)/sign-up/[[...sign-up]]/page.tsx for sing-up

import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

// Metadata for the sign-up page
export const metadata: Metadata = {
  title: "Sign Up | Discord",
  description: "Sign up for Discord",
};

// This is the sign-up page for the application. It uses the Clerk library to handle user sign-up.
export default function SignUpPage() {
  return <SignUp />;
}
