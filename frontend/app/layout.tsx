import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";

const francy = Playfair_Display({
  variable: "--font-francy",
  subsets: ["latin"],
  weight: ["400", "700"], // Francy is usually bold/display
});

const glacial = Quicksand({
  variable: "--font-glacial",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Glacial has normal weights
});

export const metadata: Metadata = {
  title: "Qortex – Trustless AI Verification",
  description: "Verify AI integrity on Qubic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${francy.variable} ${glacial.variable} antialiased bg-[#1e1e2e] text-[#fff3e0]`}
      >
        {children}
      </body>
    </html>
  );
}
