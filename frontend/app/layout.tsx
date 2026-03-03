import type { Metadata } from "next";
import "./globals.css";
import { SafeGoogleProvider } from "@/components/SafeGoogleProvider";

export const metadata: Metadata = {
  title: "Winlytics – Data-Driven Career Tracking",
  description: "Strategically navigate your job search and maximize your chances of landing an offer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SafeGoogleProvider>{children}</SafeGoogleProvider>
      </body>
    </html>
  );
}
