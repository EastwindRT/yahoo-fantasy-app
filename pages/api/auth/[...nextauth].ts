import NextAuth, { NextAuthOptions } from 'next-auth'
import YahooProvider from "next-auth/providers/yahoo"

export const authOptions: NextAuthOptions = {
  providers: [
    YahooProvider({
      clientId: process.env.YAHOO_CLIENT_ID!,
      clientSecret: process.env.YAHOO_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)