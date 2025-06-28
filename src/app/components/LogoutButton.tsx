'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-red-200 hover:underline"
        >
            ログアウト
        </button>
    )
}