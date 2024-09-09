import axios from 'axios'

const YAHOO_FANTASY_BASE_URL = 'https://fantasysports.yahooapis.com/fantasy/v2'

export async function getYahooFantasyData(accessToken: string, endpoint: string) {
  try {
    const response = await axios.get(`${YAHOO_FANTASY_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Yahoo Fantasy data:', error)
    throw error
  }
}

// Add more specific API call functions here as needed, for example:
export async function getUserLeagues(accessToken: string) {
  return getYahooFantasyData(accessToken, '/users;use_login=1/games;game_keys=nfl/leagues')
}

export async function getLeagueTeams(accessToken: string, leagueKey: string) {
  return getYahooFantasyData(accessToken, `/league/${leagueKey}/teams`)
}