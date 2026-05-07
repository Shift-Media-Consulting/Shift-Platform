import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "shift.media — Independent Production Advisory",
  description: "We stand between creative vision and commercial reality — protecting budgets without compromising craft. Hamburg, DE.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Onest:wght@400;500;700&family=Newsreader:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
