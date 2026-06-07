import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import localFont from "next/font/local";

const minecraftia = localFont({
  src: "../../public/font/Minecraft.ttf",
  variable: "--minecraftia",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "poppang minecraft",
  description: "Poppang's minecraft event site",
};

function GridBackground() {
  return (
    <svg
      aria-hidden
      className="text-teal pointer-events-none fixed inset-0 -z-10 h-full w-full"
    >
      <defs>
        <pattern id="grid" width={60} height={60} patternUnits="userSpaceOnUse">
          {/* grid lines */}
          <path
            d="M20 0V60 M40 0V60 M0 20H60 M0 40H60"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
            fill="none"
          />
          {/* big square border */}
          <path
            d="M0 0V60 M0 0H60"
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={2}
            fill="none"
          />
          {/* inward arms at each corner -> full crosshair at every grid intersection */}
          <path
            d="M0 0H5 M0 0V5 M60 0H55 M60 0V5 M0 60H5 M0 60V55 M60 60H55 M60 60V55"
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1.5}
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${minecraftia.variable} relative bg-[#0a1413] antialiased`}
      >
        <GridBackground />
        {children}
      </body>
    </html>
  );
}
