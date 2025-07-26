// app/page.tsx
import Image from "next/image"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authOptions'

import Fortune from '@/app/components/fortune'

export default async function Home() {
  const session = await getServerSession(authOptions as any) as any

  return (
    <div className="text-center px-2 py-4 md:px-8 md:py-8 lg:px-16 lg:py-12">
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        <Image
          src="/maya-bg.png"
          alt="トップ画像"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold">マヤ占いへようこそ</h1>
          <p className="mt-2 text-lg md:text-xl">あなたのKINナンバーを見つけましょう</p>
        </div>
      </div>
      
      {session?.user?.birthday && session.user.name ? (
        // ログイン済みユーザー向けコンテンツ
        <>
          <div className="p-4 sm:p-6 md:p-10 bg-white rounded-lg max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mt-4">
            <h1 className="text-lg md:text-xl text-black">
              ようこそ、{session.user.name}さん
            </h1>
            <p className="mt-10 text-black">
              人は、自分が望む人生の目的を生きるのに最もふさわしい日を選んで生まれてくるのです。
            </p>
            <p className="mt-5 text-black">
              あなたも誕生日に秘められたエネルギーを紐解いてみませんか？
            </p>
            <Fortune birthday={session.user.birthday} name={session.user.name} />
          </div>
        </>
      ) : (
        // 未ログインユーザー向けコンテンツ
        <div className="p-4 sm:p-6 md:p-10 bg-white rounded-lg max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mt-4">
          <div className="max-w-4xl mx-auto px-2 md:px-8 lg:px-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              マヤ暦占いで自分の運命を解き明かそう
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              マヤ暦は、古代マヤ文明が生み出した高度な暦法です。あなたの誕生日から導き出されるKINナンバーは、
              あなたの本質的な性格や運命の方向性を示しています。
            </p>
            
            {/* 無料占いセクション */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  無料でKINナンバーを診断
                </h3>
                <p className="text-gray-600 mb-4">
                  誕生日を入力するだけで、あなたのKINナンバーを無料で診断できます
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/free-fortune"
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    無料占いを始める
                  </a>
                  <a
                    href="/lp-tiktok"
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    🎯 TikTok風診断
                  </a>
                  <a
                    href="/tarot"
                    className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    🔮 タロット占い
                  </a>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mb-8">
              <div className="bg-purple-50 p-4 sm:p-6 md:p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">🌟 KINナンバー</h3>
                <p className="text-gray-700">
                  誕生日から計算される1〜260の数字で、あなたの本質的な性格と運命を表します。
                </p>
              </div>
              <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">🔮 易（えき）</h3>
                <p className="text-gray-700">
                  古代中国の易経に基づく占術で、KINナンバーに対応する易の意味を解釈します。
                </p>
              </div>
              <div className="bg-green-50 p-4 sm:p-6 md:p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🎯 運勢鑑定</h3>
                <p className="text-gray-700">
                  年齢ごとの運勢を計算し、人生の節目でのアドバイスを提供します。
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-8 md:p-12 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">今すぐ始めよう</h3>
              <p className="text-lg mb-6">
                アカウントを作成して、あなたのマヤ暦占いを体験してください。
              </p>
              <div className="space-x-0 space-y-2 sm:space-x-4 sm:space-y-0 flex flex-col sm:flex-row justify-center items-center max-w-2xl mx-auto">
                <a
                  href="/register"
                  className="inline-block w-full sm:w-auto bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  新規登録
                </a>
                <a
                  href="/login"
                  className="inline-block w-full sm:w-auto bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
                >
                  ログイン
                </a>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                マヤ暦占いで、あなたの人生の新しい扉を開きましょう
              </p>
              <p className="text-sm text-gray-500">
                ※ 占い結果は参考情報です。人生の選択はご自身の判断でお決めください。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
