// app/api/register/route.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const { name, email, password, birthday } = await req.json()

        // 同じメールのユーザーがいないか確認
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return Response.json({ success: false, error: 'すでに登録されています。' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                birthday: new Date(birthday),
                passwordHash: hashedPassword,
            },
        })

        return Response.json({ success: true })
    } catch (err) {
        console.error(err)
        return Response.json({ success: false, error: '登録に失敗しました。' }, { status: 500 })
    }
}