import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import type { Session, User as NextAuthUser } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import type { User } from '@prisma/client'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt' as const,
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser | User }) {
            // ログイン時に user の情報を token に保存
            if (user) {
                token.sub = (user as User).id
                token.role = (user as User).role
                const birthday = (user as User).birthday
                token.birthday = birthday instanceof Date ? birthday.toISOString() : String(birthday)
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            // セッションに role と id を追加
            if (session.user) {
                session.user.id = token.sub as string
                session.user.role = token.role as string
                session.user.birthday = token.birthday as string
            }
            return session
        },
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.passwordHash) return null

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
                if (!isValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    birthday: user.birthday
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
}