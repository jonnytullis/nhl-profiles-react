export default function getTeamLogoUrl(teamId: number | string): string {
  return `http://www-league.nhlstatic.com/nhl.com/builds/site-core/d1b262bacd4892b22a38e8708cdb10c8327ff73e_1579810224/images/logos/team/current/team-${teamId}-dark.svg`;
}
