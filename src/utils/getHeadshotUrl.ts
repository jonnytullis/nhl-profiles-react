/* 
  I was getting 403 errors from most of the URLs provided for headshots, so I just used the one that worked without authorization.
  Normally, I would have fetched smaller images to optimize loading.

  These are the URLs that were not working for me:
    https://nhl.bamcontent.com/images/headshots/current/168X168/{playerId}.jpg
    https://nhl.bamcontent.com/images/headshots/current/168X168/{playerId}@2x.jpg
    https://nhl.bamcontent.com/images/headshots/current/168X168/{playerId}@3x.jpg
*/
export default function getHeadshotUrl(playerId: number | string, teamAbbreviation: string, seasonId: string): string {
  return `https://assets.nhle.com/mugs/nhl/${seasonId}/${teamAbbreviation}/${playerId}.png`;
}
