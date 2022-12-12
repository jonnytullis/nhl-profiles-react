import React, { useEffect } from 'react';
import {
  Box,
  Container,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Paper,
  Grid,
  Typography,
  Link,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import useNetwork from '../../hooks/useNetwork';
import useAlert from '../../hooks/useAlert';
import fetchPlayer from '../../network/fetchPlayer';
import fetchTeam from '../../network/fetchTeam';
import fetchCurrentSeason from '../../network/fetchCurrentSeason';
import getHeadshotUrl from '../../utils/getHeadshotUrl';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';
import getYesNoText from '../../utils/getYesNoText';
import { Person, Team, Season } from '../../types';

function PlayerInfoTable({ player }: { player: Person }): React.ReactElement {
  const theme = useTheme();

  function getHeaderCell(text: string): React.ReactElement {
    return <TableCell sx={{ color: theme.palette.text.secondary }}>{text}</TableCell>;
  }

  return (
    <Table aria-label="Team Roster">
      <TableHead>
        <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary }}>
          {getHeaderCell('Age')}
          {getHeaderCell('Height')}
          {getHeaderCell('Weight (lbs)')}
          {getHeaderCell('#')}
          {getHeaderCell('Position')}
          {getHeaderCell('Shoot/Catch Hand')}
          {getHeaderCell('Nationality')}
          {getHeaderCell('Captain?')}
          {getHeaderCell('Rookie?')}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{player.currentAge}</TableCell>
          <TableCell>{player.height}</TableCell>
          <TableCell>{player.weight}</TableCell>
          <TableCell>{player.primaryNumber}</TableCell>
          <TableCell>{player.primaryPosition?.name}</TableCell>
          <TableCell>{player.shootsCatches}</TableCell>
          <TableCell>{player.nationality}</TableCell>
          <TableCell>{getYesNoText(player.captain)}</TableCell>
          <TableCell>{getYesNoText(player.rookie)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function Player(): React.ReactElement {
  const { id } = useParams();
  const raiseAlert = useAlert();
  const [executeFetchPlayer, { data: personData, error: personError }] =
    useNetwork<Record<'people', Person[]>>(fetchPlayer);
  const [executeFetchTeam, { data: teamData, error: teamError }] = useNetwork<Record<'teams', Team[]>>(fetchTeam);
  const [executeFetchSeason, { data: seasonData, error: seasonError }] =
    useNetwork<Record<'seasons', Season[]>>(fetchCurrentSeason);

  const player = personData?.people?.[0];
  const team = teamData?.teams?.[0];
  const season = seasonData?.seasons?.[0];

  useEffect(() => {
    let message;
    if (personError) {
      message = 'Failed to fetch player info';
    } else if (teamError) {
      message = 'Failed to fetch team info';
    } else if (seasonError) {
      message = 'Failed to fetch season info';
    }

    if (message) {
      raiseAlert({ message, severity: 'error' });
    }
  }, [personError, raiseAlert, seasonError, teamError]);

  useEffect(() => {
    executeFetchSeason();
  }, [executeFetchSeason]);

  useEffect(() => {
    if (id) {
      executeFetchPlayer({ playerId: id });
    }
  }, [executeFetchPlayer, id]);

  useEffect(() => {
    if (personData) {
      const teamId = personData.people?.[0]?.currentTeam?.id;
      executeFetchTeam({ teamId });
    }
  }, [executeFetchTeam, personData]);

  return (
    <Container sx={{ paddingY: 3 }}>
      {player && team && season && (
        <>
          <Paper sx={{ padding: 3 }}>
            <ProfileHeader
              imageUrl={getHeadshotUrl(player.id, team.abbreviation, season.seasonId)}
              title={player.fullName}
              roundImage
              subtitle={
                <Link href={`/team/${team.id}`}>
                  <Grid container alignItems="center" columnSpacing={2}>
                    <Grid item>
                      <Box
                        component="img"
                        alt="Team Logo"
                        src={getTeamLogoUrl(team.id)}
                        sx={{ height: 50, width: 50 }}
                      />
                    </Grid>
                    <Grid item>{team.name}</Grid>
                  </Grid>
                </Link>
              }
            />
          </Paper>
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <PlayerInfoTable player={player} />
          </TableContainer>
        </>
      )}
    </Container>
  );
}

export default Player;
