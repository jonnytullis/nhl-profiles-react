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
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import useAlert from '../../hooks/useAlert';
import fetchPlayer from '../../network/fetchPlayer';
import fetchTeam from '../../network/fetchTeam';
import fetchCurrentSeason from '../../network/fetchCurrentSeason';
import getHeadshotUrl from '../../utils/getHeadshotUrl';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';
import getYesNoText from '../../utils/getYesNoText';
import { Person } from '../../types';

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

function PlayerProfile(): React.ReactElement {
  const { id } = useParams();
  const raiseAlert = useAlert();
  const { data: player, error: playerError } = useQuery({
    queryKey: ['player_query', id],
    queryFn: () => fetchPlayer({ playerId: id ?? '' }),
    enabled: !!id,
  });
  const { data: team, error: teamError } = useQuery({
    queryKey: ['team_query', id],
    queryFn: () => fetchTeam({ teamId: String(player?.currentTeam?.id) ?? '' }),
    enabled: !!player?.currentTeam?.id,
  });
  const { data: season, error: seasonError } = useQuery({
    queryKey: ['current_season'],
    queryFn: fetchCurrentSeason,
  });

  useEffect(() => {
    let message;
    if (playerError) {
      message = 'Failed to fetch player info';
    } else if (teamError) {
      message = 'Failed to fetch team info';
    } else if (seasonError) {
      message = 'Failed to fetch season info';
    }

    if (message) {
      raiseAlert({ message, severity: 'error' });
    }
  }, [playerError, raiseAlert, seasonError, teamError]);

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
                <Link to={`/team/${team.id}`}>
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

export default PlayerProfile;
