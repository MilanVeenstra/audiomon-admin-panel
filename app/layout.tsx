import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AudioMon Admin Panel",
  description: "Admin dashboard for AudioMon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
