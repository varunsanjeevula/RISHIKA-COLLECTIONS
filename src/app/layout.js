import { Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rishika Collections | Premium Clothes & Jewellery",
  description:
    "Discover exquisite handpicked Clothes & Jewellery at Rishika Collections. Shop sarees, kurtis, lehengas, necklaces, earrings, bangles and more. Order via WhatsApp.",
  keywords: "clothes, jewellery, saree, kurti, lehenga, necklace, earrings, bangles, indian fashion, rishika collections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
