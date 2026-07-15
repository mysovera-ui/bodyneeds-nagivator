import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "BodyNeeds Navigator",
  description:
    "Search common symptoms and see their nutritional context — lifestyle factors, nutrients, food sources, and supplement safety guidance.",
  appleWebApp: {
    title: "BodyNeeds Navigator",
    statusBarStyle: "default",
    capable: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-50 min-h-screen">
        <Sidebar />
        <div className="sm:pl-64 pt-14 sm:pt-0 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
