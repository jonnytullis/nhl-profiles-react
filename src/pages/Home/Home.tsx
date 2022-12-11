import React, { useEffect, useMemo } from 'react';
import { Box, Container, Grid, Paper, Typography, Link, Divider } from '@mui/material';
import useNetwork from '../../hooks/useNetwork';
import fetchTeams from '../../network/fetchTeams';
import { Team } from '../../types';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';

type Division = {
  divisionName: string;
  teams: Team[];
};
type Conference = {
  conferenceName: string;
  divisions: Record<string, Division>;
};
type ConferenceMap = Record<string, Conference>;

function TeamView({ team }: { team: Team }): React.ReactElement {
  const href = `/team/${team.id}`;
  return (
    <Link href={href}>
      <Grid container columnSpacing={2} alignItems="center">
        <Grid item>
          <Box
            component="img"
            draggable={false}
            src={getTeamLogoUrl(team.id)}
            alt="Team Logo"
            sx={{ height: 50, width: 50 }}
          />
        </Grid>
        <Grid item sx={{ width: 200 }}>
          <Typography variant="subtitle1">{team.name}</Typography>
        </Grid>
      </Grid>
    </Link>
  );
}

function DivisionView({ division }: { division: Division }): React.ReactElement {
  const teams = division.teams;
  return (
    <>
      <Typography variant="h5" sx={{ marginTop: 6, marginBottom: 1 }}>
        {division.divisionName} Division
      </Typography>
      <Grid item container spacing={1}>
        {teams?.map((team) => (
          <Grid key={team.id} item>
            <TeamView team={team} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function ConferenceView({ conference }: { conference: Conference }): React.ReactElement {
  const divisionsList = Object.values(conference.divisions);
  return (
    <>
      <Typography variant="h4">{conference.conferenceName} Conference</Typography>
      <Grid item container>
        {divisionsList.map((division, i) => (
          <DivisionView key={division.divisionName} division={division} />
        ))}
      </Grid>
    </>
  );
}

function Home(): React.ReactElement {
  const [executeFetchTeams, { data: teamsData }] = useNetwork<Record<'teams', Team[]>>(fetchTeams);

  useEffect(() => {
    executeFetchTeams();
  }, [executeFetchTeams]);

  const teamGrouping: ConferenceMap = useMemo(() => {
    return (
      teamsData?.teams?.reduce<ConferenceMap>((total, curr) => {
        const conferenceName = curr.conference?.name;
        const divisionName = curr.division?.name;

        if (!total[conferenceName]) {
          total[conferenceName] = { conferenceName, divisions: {} };
        }
        const conference = total[conferenceName];

        if (!conference.divisions[divisionName]) {
          conference.divisions[divisionName] = { divisionName, teams: [] };
        }

        conference.divisions[divisionName].teams.push(curr);

        return total;
      }, {}) ?? {}
    );
  }, [teamsData]);

  return (
    <Container sx={{ paddingY: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h3">Teams</Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          A listing of all teams for the National Hockey League
        </Typography>
      </Paper>
      <Paper sx={{ marginTop: 3, padding: 3 }}>
        <Grid container spacing={5}>
          {Object.values(teamGrouping).map((conference, i, items) => (
            <Grid key={conference.conferenceName} item>
              <ConferenceView conference={conference} />
              {i < items.length - 1 && <Divider sx={{ marginTop: 6 }} />}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home;
