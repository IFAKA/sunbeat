import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sunbeat.vercel.app"),
  title: "Sunbeat: music that never needs charging",
  description: "A tiny clip with a solar cell that plays your own songs through your own wired earbuds. Room light keeps it going. A concept with a real 3D model, parts list and open plan.",
  openGraph: { title: "Sunbeat", description: "Music that never needs charging.", images: ["/social.png"] },
};
export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} style={{ colorScheme: "dark" }}>
      <body>{children}</body>
    </html>
  );
}
