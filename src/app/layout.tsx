import type { Metadata } from "next";
import "./globals.css";
import Header from './components/Header'
import SessionProviderWrapper from './components/SessionProviderWrapper'

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
      <head>
        <script src="https://js.pay.jp/v2/pay.js" async></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow">{children}</main>
          {/* --- A8.net広告バナー（小型化） --- */}
          <div className="flex justify-center my-4">
            <a href="https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C4DVL" rel="nofollow">
              <img style={{border:0}} width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002036000&mc=1" />
            </a>
            <img style={{border:0}} width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C4DVL" alt="" />
          </div>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-200 text-center text-sm py-4 text-gray-600">
      &copy; {new Date().getFullYear()} Reinouranaisi. All rights reserved.
    </footer>
  )
}