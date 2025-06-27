'use clinet'

import Link from 'next/link'

export default function Header() {
    return (
        <header className="bg-blue-700 text-white px-6 py-4 shadow">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wide">
                    🌟 マヤ占い
                </Link>
                <nav className="space-x-4 text-sm">
                    <Link href="/fortune" className="hover:underline">
                        運勢鑑定
                    </Link>
                    <Link href="/compatibility" className="hover:underline">
                        相性鑑定
                    </Link>
                    <Link href="/group_compatibility" className="hover:underline">
                        グループ相性鑑定
                    </Link>
                    <Link href="/timeline" className="hover:underline">
                        KIN年表作成
                    </Link>
                    <Link href="/takuzitsu" className="hover:underline">
                        択日
                    </Link>
                    <Link href="/tarot" className="hover:underline">
                        タロット
                    </Link>
                    <Link href="/login" className="hover:underline">
                        ログイン
                    </Link>
                </nav>
            </div>
        </header>
    )
}