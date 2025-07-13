import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-primary",
});
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-display",
});

export const metadataZ: Metadata = {
  title: "Primacy Storefront",
  description: "Upgrade Your OS - Primacy APEX & RESET",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} antialiased`}
      >
        <Navbar />
        <main>
          <CartProvider>{children}</CartProvider>;
        </main>
      </body>
    </html>
  );
}
