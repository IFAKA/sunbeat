import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { THEME_COLOR } from "@/components/ui";

const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sunbeat-black.vercel.app"),
  title: "Sunbeat: music that never needs charging",
  description: "A tiny clip with a solar cell that plays your own songs through your own wired earbuds. Room light keeps it going. A concept with a real 3D model, parts list and open plan.",
  openGraph: { title: "Sunbeat", description: "Music that never needs charging.", images: ["/social.png"] },
};
export const viewport: Viewport = { themeColor: THEME_COLOR };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
