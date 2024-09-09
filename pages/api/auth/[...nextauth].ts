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
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn callback:", { user, account, profile, email, credentials });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      const customDomain = "https://YahooApp.renjiththomas.repl.co";
      const replitDevDomain = "https://0b03376a-d81e-4681-bef0-78b1398ddb46-00-15ph47k1km4it.kirk.replit.dev";

      if (url.startsWith(customDomain) || url.startsWith(replitDevDomain)) {
        return url;
      }
      // If it's not one of our domains, redirect to the base URL
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT callback:", { token, user, account, profile, isNewUser });
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("Session callback:", { session, token, user });
      session.accessToken = token.accessToken as string;
      session.userId = token.id as string;
      return session;
    }
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    }
  },
  events: {
    async signIn(message) { console.log("SignIn event:", message) },
    async signOut(message) { console.log("SignOut event:", message) },
    async createUser(message) { console.log("CreateUser event:", message) },
    async updateUser(message) { console.log("UpdateUser event:", message) },
    async linkAccount(message) { console.log("LinkAccount event:", message) },
    async session(message) { console.log("Session event:", message) },
  }
}

// Log the NEXTAUTH_URL for debugging
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

export default NextAuth(authOptions)