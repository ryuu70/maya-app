import type { Metadata } from "next";
import "./globals.css";
import Header from './components/Header'

export const metadata: Metadata = {
  title: "マヤ占い",
  description: "生年月日から運命を読みとくWeb占いシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-gro">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-200 text-center text-sm py-4 text-gray-600">
      &copy; {new Date().getFullYear()} Kougetuyuu. All rights reserved.
    </footer>
  )
}