// app/(auth)/(routes)/sign-up/[[...sign-up]]/page.tsx for sing-in
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

// Metadata for the sign-up page
export const metadata: Metadata = {
  title: "Sign In | Discord",
  description: "Sign in for Discord",
};

// This is the sign-in page for the application. It uses the Clerk library to handle user sign-in.
export default function SignInPage() {
  return <SignIn />;
}
