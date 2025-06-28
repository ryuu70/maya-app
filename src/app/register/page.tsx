// src/app/register/page.tsx

'use client'

import { useState } from 'react'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthday, setBirthday] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        alert('/api/registerへ');
        console.log("/api/registerへ");
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, birthday }),
        })

        const data = await res.json()
        console.log(data);
        setMessage(data.success ? '登録が完了しました！' : `エラー: ${data.error}`)
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">ユーザー登録</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input required className="w-full border p-2" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
                <input required type="email" className="w-full border p-2" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input required type="password" className="w-full border p-2" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input required type="date" className="w-full border p-2" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">登録</button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}