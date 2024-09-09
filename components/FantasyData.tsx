import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getUserLeagues } from '../lib/yahooFantasyApi'

interface LeagueData {
  league_key: string;
  name: string;
  // Add other properties as needed
}

const FantasyData = () => {
  const { data: session, status } = useSession()

  const [leagues, setLeagues] = useState<LeagueData[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (session?.accessToken) {
        try {
          const leaguesData = await getUserLeagues(session.accessToken)
          setLeagues(leaguesData)
        } catch (err) {
          setError('Failed to fetch fantasy data')
        }
      }
    }
    fetchData()
  }, [session])

  if (status === "loading") return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!leagues) return <div>No league data available</div>

  return (
    <div>
      <h2>Your Fantasy Leagues</h2>
      <pre>{JSON.stringify(leagues, null, 2)}</pre>
    </div>
  )
}

export default FantasyData