import React, { useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import useNetwork from '../../hooks/useNetwork';
import fetchTeams from '../../network/fetchTeams';
import { Team } from '../../interfaces';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';

type TeamGridItemProps = {
  team: Team;
};

function TeamGridItem({ team }: TeamGridItemProps): React.ReactElement {
  return (
    <Grid container columnSpacing={2} alignItems="center" sx={{ paddingY: 4 }}>
      <Grid item>
        <Box component="img" src={getTeamLogoUrl(team.id)} alt="Team Logo" sx={{ height: 50, width: 50 }} />
      </Grid>
      <Grid item sx={{ width: 225 }}>
        <Typography variant="subtitle1">{team.name}</Typography>
      </Grid>
    </Grid>
  );
}

export default function Home(): React.ReactElement {
  const [executeFetchTeams, { data: teamsData }] = useNetwork<Record<'teams', Team[]>>(fetchTeams);

  useEffect(() => {
    executeFetchTeams();
  }, [executeFetchTeams]);

  return (
    <Container sx={{ paddingY: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h3">Teams</Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          A listing of all teams for the National Hockey League
        </Typography>
      </Paper>
      <Paper sx={{ marginTop: 3, padding: 3 }}>
        <Grid container justifyContent="space-between">
          {teamsData?.teams?.map((team) => (
            <Grid key={team.id} item>
              <TeamGridItem team={team} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
