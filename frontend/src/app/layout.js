import { Lora } from "next/font/google";
import "./globals.css";

const FONT = Lora({ subsets: ["latin"] });

export const metadata = {
  title: "Hassan Pizzeria & Kebab",
  description: "Pizzeria & Kebab Starogard Gdańsk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={FONT.className}>{children}</body>
    </html>
  );
}
