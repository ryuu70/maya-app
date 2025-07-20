'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-2 py-2 text-red-200 hover:text-red-100 hover:bg-red-500/10 rounded-lg transition-all duration-200 font-medium text-xs"
        >
            ログアウト
        </button>
    )
}