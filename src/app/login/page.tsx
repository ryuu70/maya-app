'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (res?.ok) {
            router.push('/') // 成功時リダイレクト
        } else {
            setMessage('ログイン失敗')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">ログイン</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    ログイン
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </div>
    )
}