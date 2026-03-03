"use client";

import dynamic from "next/dynamic";

const GoogleProvider = dynamic(
  () =>
    import("@/components/GoogleProvider")
      .then((m) => ({ default: m.GoogleProvider }))
      .catch(() => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> })),
  { ssr: false }
);

export function SafeGoogleProvider({ children }: { children: React.ReactNode }) {
  return <GoogleProvider>{children}</GoogleProvider>;
}
