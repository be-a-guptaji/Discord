import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSANS = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discord",
  description: "Discord Clone form the ashes on the Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSANS.variable} antialiased`}>{children}</body>
    </html>
  );
}
