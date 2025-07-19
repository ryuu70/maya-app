'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (res?.ok) {
            router.push('/') // 成功時リダイレクト
        } else {
            setMessage('メールアドレスまたはパスワードが正しくありません')
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* ロゴ・タイトルエリア */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                        <span className="text-3xl">🌟</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">マヤ占い</h1>
                    <p className="text-purple-200">あなたの運命を解き明かそう</p>
                </div>

                {/* ログインフォーム */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">ログイン</h2>
                        <p className="text-purple-200 text-sm">アカウントにログインしてください</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* メールアドレス入力 */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* パスワード入力 */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                                パスワード
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* エラーメッセージ */}
                        {message && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                                <p className="text-red-200 text-sm flex items-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* ログインボタン */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    ログイン中...
                                </div>
                            ) : (
                                'ログイン'
                            )}
                        </button>
                    </form>

                    {/* 登録リンク */}
                    <div className="mt-6 text-center">
                        <p className="text-purple-200 text-sm">
                            アカウントをお持ちでない方は{' '}
                            <Link href="/register" className="text-purple-300 hover:text-white font-semibold underline transition-colors duration-200">
                                新規登録
                            </Link>
                        </p>
                    </div>
                </div>

                {/* フッター */}
                <div className="text-center mt-8">
                    <p className="text-purple-300 text-xs">
                        © 2024 マヤ占い. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}