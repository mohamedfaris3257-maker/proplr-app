import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proplr — UAE Student Career Development",
  description: "Empowering UAE students to build their future through structured career development across six pillars.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
