'use client'


import { SessionProvider } from "next-auth/react"

export default function NextAuthProvider({ children, session }: { children: any, session: any }): React.ReactNode {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}