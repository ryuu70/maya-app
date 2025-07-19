'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import LogoutButton from './LogoutButton'

export default function Header() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // スクロール検知
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // メニューを閉じる
    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    // ログアウト処理
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' })
        closeMenu()
    }

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-purple-900/95 backdrop-blur-md shadow-xl border-b border-purple-700/30' 
                : 'bg-purple-900/85 backdrop-blur-md'
        }`}>
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex justify-between items-center">
                    {/* ロゴ */}
                    <Link href="/" className="flex items-center space-x-3 text-2xl font-bold tracking-wide text-white hover:text-purple-200 transition-colors group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                            <span className="text-xl">🌟</span>
                        </div>
                        <span className="hidden sm:block">マヤ占い</span>
                    </Link>

                    {/* デスクトップナビゲーション */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <div className="flex space-x-1">
                            <Link href="/fortune" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">運勢鑑定</Link>
                            <Link href="/compatibility" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">相性鑑定</Link>
                            <Link href="/group_compatibility" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">グループ相性</Link>
                            <Link href="/timeline" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">KIN年表</Link>
                            <Link href="/takuzitsu" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">択日</Link>
                            <Link href="/tarot" className="px-4 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium">タロット</Link>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
                            {(session?.user as any)?.role === 'ADMIN' && (
                                <Link href="/admin" className="px-3 py-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 font-medium text-sm">
                                    👑 管理
                                </Link>
                            )}
                            {session ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {session.user?.name?.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="text-white text-sm font-medium">ようこそ {session.user?.name} さん</span>
                                    </div>
                                    <LogoutButton />
                                </div>
                            ) : (
                                <Link href="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium">
                                    ログイン
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* ハンバーガーメニューボタン */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-white hover:text-purple-200 transition-colors"
                        aria-label="メニューを開く"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* モバイルメニュー */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen 
                        ? 'max-h-screen opacity-100 visible' 
                        : 'max-h-0 opacity-0 invisible'
                }`}>
                    <nav className="py-4 space-y-3 border-t border-white/20 mt-4">
                        {/* メインナビゲーション */}
                        <div className="space-y-2">
                            <Link 
                                href="/fortune" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                🔮 運勢鑑定
                            </Link>
                            <Link 
                                href="/compatibility" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                💕 相性鑑定
                            </Link>
                            <Link 
                                href="/group_compatibility" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                👥 グループ相性鑑定
                            </Link>
                            <Link 
                                href="/timeline" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                📅 KIN年表作成
                            </Link>
                            <Link 
                                href="/takuzitsu" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                📊 択日
                            </Link>
                            <Link 
                                href="/tarot" 
                                onClick={closeMenu}
                                className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                                🃏 タロット
                            </Link>
                        </div>

                        {/* 管理者メニュー */}
                        {(session?.user as any)?.role === 'ADMIN' && (
                            <div className="border-t border-white/20 pt-3">
                                <Link 
                                    href="/admin" 
                                    onClick={closeMenu}
                                    className="block text-yellow-300 hover:text-yellow-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                                >
                                    👑 管理者メニュー
                                </Link>
                            </div>
                        )}

                        {/* ユーザー情報・ログイン */}
                        <div className="border-t border-white/20 pt-3">
                            {session ? (
                                <div className="space-y-2">
                                    <div className="px-3 py-2 text-white/80 text-sm">
                                        ようこそ {session.user?.name} さん
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-white hover:text-red-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                                    >
                                        🚪 ログアウト
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    onClick={closeMenu}
                                    className="block text-white hover:text-purple-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                                >
                                    🔑 ログイン
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
