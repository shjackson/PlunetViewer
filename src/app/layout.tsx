// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import IntlProvider from "../components/IntlProvider";
import { ConfigProvider } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TBO",
  description: "TBO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider theme={{ hashed: false }}>
        <IntlProvider>{children}</IntlProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
