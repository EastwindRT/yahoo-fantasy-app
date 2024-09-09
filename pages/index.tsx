import type { NextPage } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react'
import FantasyData from '../components/FantasyData'

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div>
        <h1>Yahoo Fantasy Sports Data</h1>
        <p>You are not signed in</p>
        <button onClick={() => signIn('yahoo')}>Sign in with Yahoo</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Yahoo Fantasy Sports Data</h1>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <FantasyData />
    </div>
  )
}

export default Home