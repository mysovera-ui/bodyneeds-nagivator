import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "BodyNeeds Navigator",
  description:
    "Search common symptoms and see their nutritional context — lifestyle factors, nutrients, food sources, and supplement safety guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-50 min-h-screen">
        <Nav />
        {children}
      </body>
    </html>
  );
}
