// app/api/login/route.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.passwordHash) {
            return Response.json({ error: 'ユーザーが見つかりません。' }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
            return Response.json({ error: 'パスワードが違います。' }, { status: 401 })
        }

        // TODO: セッション or JWT を発行
        return Response.json({ success: true, user: { id: user.id, name: user.name, role: user.role } })
    } catch (err) {
        console.error(err)
        return Response.json({ error: 'ログイン中にエラーが発生しました。' }, { status: 500 })
    }
}