import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

type AppPropsWithSession = AppProps & {
  pageProps: {
    session?: Session | null
  }
}

function MyApp({ Component, pageProps }: AppPropsWithSession) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp