import NextAuth, { NextAuthOptions } from 'next-auth'
import { OAuthConfig } from 'next-auth/providers'

interface YahooProfile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

const YahooProvider: OAuthConfig<YahooProfile> = {
  id: "yahoo",
  name: "Yahoo",
  type: "oauth",
  wellKnown: "https://api.login.yahoo.com/.well-known/openid-configuration",
  authorization: {
    params: {
      scope: "openid fspt-r fspt-w"
    }
  },
  token: "https://api.login.yahoo.com/oauth2/get_token",
  userinfo: "https://api.login.yahoo.com/openid/v1/userinfo",
  idToken: true,
  clientId: process.env.YAHOO_CLIENT_ID,
  clientSecret: process.env.YAHOO_CLIENT_SECRET,
  profile(profile) {
    console.log("Yahoo profile:", profile);
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture
    }
  }
}

const authOptions: NextAuthOptions = {
  providers: [YahooProvider],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.id as string;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)