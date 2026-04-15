import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reimagined Ideas | Interactive Tech Workshops",
  description:
    "Hands-on STEM workshops that help students turn drawings into interactive projects with simple materials and beginner-friendly apps.",
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
