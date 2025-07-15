declare module 'next-auth' {
    interface User {
        role?: string
    }
    interface Session {
        user?: {
            name?: string | null
            email?: string | null
            role?: string | null
            birthday?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: string
        birthday?: string
    }
}