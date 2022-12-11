export default function getHeadshotUrl(playerId: number | string, teamAbbreviation: string, seasonId: string): string {
  return `https://assets.nhle.com/mugs/nhl/${seasonId}/${teamAbbreviation}/${playerId}.png`;
}
