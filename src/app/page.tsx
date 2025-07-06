// app/page.tsx
import Image from "next/image"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authOptions'
import dynamic from 'next/dynamic'

import Fortune from '@/app/components/fortune'

export default async function Home({ searchParams }: { searchParams?: { age?: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.birthday || !session.user.name) return null

  return (
    <div className="text-center">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
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
      <div className="p-6 bg-white">
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
      <div className="p-6">
        <a
          href="/fortune"
          className="inline-block bg-blue-600 text-white px-6 py-3 mt-6 rounded hover:bg-blue-700"
        >
          占いを始める
        </a>
      </div>
    </div>
  )
}
