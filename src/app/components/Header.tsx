import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authOptions'
import LogoutButton from './LogoutButton'
export default async function Header() {
    const session = await getServerSession(authOptions as any) as any

    return (
        <header className="fixed top-0 w-full z-50 bg-purple-900/70 backdrop-blur-md text-white px-6 py-4 shadow">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wide">
                    🌟 マヤ占い
                </Link>
                <nav className="space-x-4 text-sm flex items-center">
                    <Link href="/fortune" className="hover:underline">運勢鑑定</Link>
                    <Link href="/compatibility" className="hover:underline">相性鑑定</Link>
                    <Link href="/group_compatibility" className="hover:underline">グループ相性鑑定</Link>
                    <Link href="/timeline" className="hover:underline">KIN年表作成</Link>
                    <Link href="/takuzitsu" className="hover:underline">択日</Link>
                    <Link href="/tarot" className="hover:underline">タロット</Link>
                    {session?.user?.role === 'ADMIN' && (
                        <Link href="/admin" className="hover:underline text-yellow-300">管理者メニュー</Link>
                    )}
                    {session ? (
                        <>
                            <span className="ml-4">ようこそ {session.user?.name} さん</span>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link href="/login" className="hover:underline">ログイン</Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
