import NextAuth, { NextAuthOptions } from 'next-auth'
import YahooProvider from "next-auth/providers/yahoo"

export const authOptions: NextAuthOptions = {
  providers: [
    YahooProvider({
      clientId: process.env.YAHOO_CLIENT_ID ?? '',
      clientSecret: process.env.YAHOO_CLIENT_SECRET ?? '',
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
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  debug: true,
}

export default NextAuth(authOptions)