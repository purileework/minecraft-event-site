import "../globals.css";
import localFont from "next/font/local";

const minecraftia = localFont({
  src: "../../public/font/Minecraft.ttf",
  variable: "--minecraftia",
  display: "swap",
});

export default function OverlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${minecraftia.variable} font-minecraft antialiased`}
        style={{ background: "transparent" }}
      >
        {children}
      </body>
    </html>
  );
}
