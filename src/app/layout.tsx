import type { Metadata } from "next";
import "./globals.css";
import Header from './components/Header'
import SessionProviderWrapper from './components/SessionProviderWrapper'
import { useMemo } from "react";

export const metadata: Metadata = {
  title: "マヤ占い",
  description: "生年月日から運命を読みとくWeb占いシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 広告バナーリスト
  const adBanners = [
    {
      href: "https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C5GGH",
      img: { src: "https://www21.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002041000&mc=1", width: 1456, height: 180 },
      pixel: "https://www15.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C5GGH"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C4DVL",
      img: { src: "https://www27.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002036000&mc=1", width: 300, height: 250 },
      pixel: "https://www17.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C4DVL"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C510X",
      img: { src: "https://www20.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002039000&mc=1", width: 600, height: 500 },
      pixel: "https://www18.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C510X"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=459VF6+E80TSQ+4PWE+BXIYP",
      img: { src: "https://www22.a8.net/svt/bgt?aid=250723410860&wid=002&eno=01&mid=s00000022019002004000&mc=1", width: 468, height: 60 },
      pixel: "https://www17.a8.net/0.gif?a8mat=459VF6+E80TSQ+4PWE+BXIYP"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=459VF6+E80TSQ+4PWE+BYLJL",
      img: { src: "https://www29.a8.net/svt/bgt?aid=250723410860&wid=002&eno=01&mid=s00000022019002009000&mc=1", width: 300, height: 250 },
      pixel: "https://www17.a8.net/0.gif?a8mat=459VF6+E80TSQ+4PWE+BYLJL"
    },
  ];
  // ページ表示ごとにランダム選択
  const randomAd = useMemo(() => adBanners[Math.floor(Math.random() * adBanners.length)], []);
  return (
    <html lang="ja">
      <head>
        <script src="https://js.pay.jp/v2/pay.js" async></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow">{children}</main>
          {/* --- A8.net広告バナー（ランダム表示） --- */}
          <div className="flex justify-center my-4">
            <a href={randomAd.href} rel="nofollow">
              <img style={{border:0}} width={randomAd.img.width} height={randomAd.img.height} alt="" src={randomAd.img.src} />
            </a>
            <img style={{border:0}} width="1" height="1" src={randomAd.pixel} alt="" />
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