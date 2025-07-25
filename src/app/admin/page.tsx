import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authOptions'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

export default async function AdminPage() {
    const session = await getServerSession(authOptions as any) as any

    // 管理者以外はトップページへリダイレクト
    if (!session || session.user?.role !== 'ADMIN') {
        redirect('/')
    }

    // ✅ ユーザー一覧を取得（管理者のみ）
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPaid: true,
            renewalStatus: true,
            createdAt: true,
            payjpCustomerId: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
        },
    })

    return (
        <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-2xl font-bold mb-4">管理者ページ - ユーザー一覧</h1>

            <table className="w-full border border--300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-2 py-1 text-black">名前</th>
                        <th className="border px-2 py-1 text-black">メール</th>
                        <th className="border px-2 py-1 text-black">権限</th>
                        <th className="border px-2 py-1 text-black">課金中</th>
                        <th className="border px-2 py-1 text-black">継続申請</th>
                        <th className="border px-2 py-1 text-black">登録日</th>
                        <th className="border px-2 py-1 text-black">Pay.jp顧客ID</th>
                        <th className="border px-2 py-1 text-black">プラン</th>
                        <th className="border px-2 py-1 text-black">サブスク状態</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                            <td className="border px-2 py-1 text-black">{u.name}</td>
                            <td className="border px-2 py-1 text-black">{u.email}</td>
                            <td className="border px-2 py-1 text-black">{u.role}</td>
                            <td className="border px-2 py-1 text-black">{u.isPaid ? '✔' : '―'}</td>
                            <td className="border px-2 py-1 text-black">{u.renewalStatus}</td>
                            <td className="border px-2 py-1 text-black">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="border px-2 py-1 text-black">{u.payjpCustomerId || '―'}</td>
                            <td className="border px-2 py-1 text-black">{u.subscriptionPlan || '―'}</td>
                            <td className="border px-2 py-1 text-black">{u.subscriptionStatus || '―'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}