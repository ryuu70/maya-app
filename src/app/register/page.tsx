// src/app/register/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthday, setBirthday] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, birthday }),
            })

            const data = await res.json()
            
            if (data.success) {
                setMessage('登録が完了しました！ログインページに移動します...')
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            } else {
                setMessage(`エラー: ${data.error}`)
            }
        } catch (error) {
            setMessage('登録中にエラーが発生しました。もう一度お試しください。')
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

                {/* 登録フォーム */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">新規登録</h2>
                        <p className="text-purple-200 text-sm">アカウントを作成して始めましょう</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 名前入力 */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-purple-200">
                                お名前
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="山田太郎"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* 誕生日入力 */}
                        <div className="space-y-2">
                            <label htmlFor="birthday" className="block text-sm font-medium text-purple-200">
                                誕生日
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="birthday"
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                            <p className="text-xs text-purple-300">
                                誕生日はKINナンバーの計算に使用されます
                            </p>
                        </div>

                        {/* メッセージ表示 */}
                        {message && (
                            <div className={`rounded-lg p-3 ${
                                message.includes('完了') 
                                    ? 'bg-green-500/20 border border-green-500/30' 
                                    : 'bg-red-500/20 border border-red-500/30'
                            }`}>
                                <p className={`text-sm flex items-center ${
                                    message.includes('完了') ? 'text-green-200' : 'text-red-200'
                                }`}>
                                    {message.includes('完了') ? (
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* 登録ボタン */}
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
                                    登録中...
                                </div>
                            ) : (
                                'アカウントを作成'
                            )}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-purple-200 text-sm">
                            すでにアカウントをお持ちの方は{' '}
                            <Link href="/login" className="text-purple-300 hover:text-white font-semibold underline transition-colors duration-200">
                                ログイン
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