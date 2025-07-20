'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import LogoutButton from './LogoutButton'



export default function Header() {
    const { data: session, status } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isClient, setIsClient] = useState(false)

    // クライアントサイドでのみ実行
    useEffect(() => {
        setIsClient(true)
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        
        // 初期状態を設定
        handleScroll()
        
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

    // クライアントサイドでのみレンダリング
    if (!isClient) {
        return (
            <header className="fixed top-0 w-full z-50 bg-purple-900/85 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold tracking-wide text-white">
                            <span className="block sm:hidden">マヤ占い</span>
                            <span className="hidden sm:flex sm:items-center sm:space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🌟</span>
                                </div>
                                <span>マヤ占い</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </header>
        )
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
                    <Link href="/" className="text-2xl font-bold tracking-wide text-white hover:text-purple-200 transition-colors group">
                        <span className="block sm:hidden">マヤ占い</span>
                        <span className="hidden sm:flex sm:items-center sm:space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                                <span className="text-xl">🌟</span>
                            </div>
                            <span>マヤ占い</span>
                        </span>
                    </Link>

                    {/* デスクトップナビゲーション */}
                    <nav className="hidden xl:flex items-center space-x-1">
                        <div className="flex space-x-1">
                            <Link href="/fortune" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">運勢鑑定</Link>
                            <Link href="/compatibility" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">相性鑑定</Link>
                            <Link href="/group_compatibility" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">グループ相性</Link>
                            <Link href="/timeline" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">KIN年表</Link>
                            <Link href="/takuzitsu" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">択日</Link>
                            <Link href="/tarot" className="px-3 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm">タロット</Link>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
                            {status === 'loading' ? (
                                <div className="w-7 h-7 bg-gray-600 rounded-full animate-pulse"></div>
                            ) : (
                                <>
                                    {(session?.user as any)?.role === 'ADMIN' && (
                                        <Link href="/admin" className="px-2 py-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 font-medium text-xs">
                                            👑 管理
                                        </Link>
                                    )}
                                                                        {session ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {session.user?.name?.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-white text-xs font-medium hidden 2xl:block">ようこそ {session.user?.name} さん</span>
                                            </div>
                                            <Link href="/subscription" className="px-2 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200 font-medium text-xs">
                                                💳 サブスク
                                            </Link>
                                            <LogoutButton />
                                        </div>
                                    ) : (
                                        <Link href="/login" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium text-sm">
                                            ログイン
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* タブレットナビゲーション（lg-xl） */}
                    <nav className="hidden lg:flex xl:hidden items-center space-x-1">
                        <div className="flex space-x-1">
                            <Link href="/fortune" className="px-2 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-xs">運勢</Link>
                            <Link href="/compatibility" className="px-2 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-xs">相性</Link>
                            <Link href="/tarot" className="px-2 py-2 text-white hover:text-purple-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-xs">タロット</Link>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-white/20">
                            {status === 'loading' ? (
                                <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
                            ) : (
                                <>
                                    {(session?.user as any)?.role === 'ADMIN' && (
                                        <Link href="/admin" className="px-2 py-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 font-medium text-xs">
                                            👑
                                        </Link>
                                    )}
                                    {session ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {session.user?.name?.charAt(0)}
                                        </span>
                                    </div>
                                    <Link href="/subscription" className="px-2 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200 font-medium text-xs">
                                        💳
                                    </Link>
                                    <LogoutButton />
                                </div>
                            ) : (
                                <Link href="/login" className="px-2 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium text-xs">
                                    ログイン
                                </Link>
                            )}
                                </>
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
                        {status !== 'loading' && (session?.user as any)?.role === 'ADMIN' && (
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
                            {status === 'loading' ? (
                                <div className="px-3 py-2">
                                    <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
                                </div>
                            ) : session ? (
                                <div className="space-y-2">
                                    <div className="px-3 py-2 text-white/80 text-sm">
                                        ようこそ {session.user?.name} さん
                                    </div>
                                    <Link 
                                        href="/subscription" 
                                        onClick={closeMenu}
                                        className="block text-blue-300 hover:text-blue-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                                    >
                                        💳 サブスクリプション管理
                                    </Link>
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
