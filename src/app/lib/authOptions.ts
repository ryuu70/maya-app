import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            // ログイン時に user の role を token に保存
            if (user) {
                token.role = (user as any).role
                token.birthday= (user as any).birthday
            }
            return token
        },
        async session({ session, token }) {
            // セッションに role を追加
            if (session.user) {
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