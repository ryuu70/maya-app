declare module 'next-auth' {
    interface User {
        id?: string
        role?: string
    }
    interface Session {
        user?: {
            id?: string
            name?: string | null
            email?: string | null
            role?: string | null
            birthday?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub?: string
        role?: string
        birthday?: string
    }
}