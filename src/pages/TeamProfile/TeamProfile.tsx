import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Avatar,
  Card,
  Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import useNetwork from '../../hooks/useNetwork';
import useAlert from '../../hooks/useAlert';
import fetchTeam from '../../network/fetchTeam';
import fetchCurrentSeason from '../../network/fetchCurrentSeason';
import { RosterItem, Team, Season, PositionType } from '../../types';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';
import getHeadshotUrl from '../../utils/getHeadshotUrl';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';

function RosterTable({ items, team, season }: { items: RosterItem[]; team: Team; season: Season }): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function createRow(item: RosterItem) {
    const headshotUrl = getHeadshotUrl(item.person.id, team.abbreviation, season.seasonId);
    const href = `/player/${item.person.id}`;

    return {
      id: item.person.id,
      player: (
        <Link href={href}>
          <Grid container direction={isMobile ? 'column' : 'row'} alignItems="center" columnSpacing={2}>
            <Grid item>
              <Avatar
                src={headshotUrl}
                sx={{ height: 50, width: 50, backgroundColor: theme.palette.background.paper }}
              />
            </Grid>
            <Grid item>
              <Typography textAlign={isMobile ? 'center' : 'start'}>{item.person.fullName}</Typography>
            </Grid>
          </Grid>
        </Link>
      ),
      jerseyNumber: item.jerseyNumber,
      position: item.position.name,
    };
  }

  const rows = items.map((player) => createRow(player));

  const headerCellStyle = { color: theme.palette.text.secondary };

  return (
    <Card variant="outlined">
      <Table aria-label="Team Roster">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary }}>
            <TableCell sx={headerCellStyle}>Player</TableCell>
            <TableCell sx={headerCellStyle}>#</TableCell>
            <TableCell sx={headerCellStyle}>Position</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: theme.palette.background.default,
              }}
            >
              <TableCell>{row.player}</TableCell>
              <TableCell>{row.jerseyNumber}</TableCell>
              <TableCell>{row.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function TeamProfile(): React.ReactElement {
  const { id } = useParams();
  const raiseAlert = useAlert();
  const [executeFetchTeam, { data: teamData, error: teamError }] = useNetwork<Record<'teams', Team[]>>(
    'teams_request',
    fetchTeam
  );
  const [executeFetchSeason, { data: seasonData, error: seasonError }] = useNetwork<Record<'seasons', Season[]>>(
    'seasons_request',
    fetchCurrentSeason
  );
  const team = teamData?.teams?.[0];
  const season = seasonData?.seasons?.[0];

  const { defense, forwards, goalies } = useMemo(() => {
    const defenseItems: RosterItem[] = [];
    const forwardItems: RosterItem[] = [];
    const goalieItems: RosterItem[] = [];

    team?.roster?.roster?.sort((a, b) => (a.person.fullName > b.person.fullName ? 1 : -1)); // Sort alphabetically

    team?.roster?.roster?.forEach((rosterItem) => {
      if (rosterItem.position.type === PositionType.defenseman) {
        defenseItems.push(rosterItem);
      } else if (rosterItem.position.type === PositionType.forward) {
        forwardItems.push(rosterItem);
      } else if (rosterItem.position.type === PositionType.goalie) {
        goalieItems.push(rosterItem);
      }
    });

    return { defense: defenseItems, forwards: forwardItems, goalies: goalieItems };
  }, [team]);

  useEffect(() => {
    let message;
    if (teamError) {
      message = 'Failed to fetch team info';
    } else if (seasonError) {
      message = 'Failed to fetch season info';
    }

    if (message) {
      raiseAlert({ message, severity: 'error' });
    }
  }, [raiseAlert, seasonError, teamError]);

  useEffect(() => {
    if (id) {
      executeFetchTeam({ teamId: id });
    }
  }, [executeFetchTeam, id]);

  useEffect(() => {
    executeFetchSeason();
  }, [executeFetchSeason]);

  return (
    <Container sx={{ paddingY: 3 }}>
      {team && season && (
        <>
          <Paper sx={{ padding: 3 }}>
            <ProfileHeader
              title={team.name}
              subtitle={`${team?.conference?.name} Conference - ${team?.division?.name} Division`}
              imageUrl={getTeamLogoUrl(team?.id ?? '')}
            />
          </Paper>
          <Paper sx={{ padding: 2, marginTop: 4 }}>
            <Typography variant="h4">Current Roster</Typography>
            {defense && (
              <Box>
                <Typography variant="h5" sx={{ marginTop: 4 }}>
                  Defense
                </Typography>
                <RosterTable items={defense} team={team} season={season} />
              </Box>
            )}
            {forwards && (
              <Box>
                <Typography variant="h5" sx={{ marginTop: 4 }}>
                  Forwards
                </Typography>
                <RosterTable items={forwards} team={team} season={season} />
              </Box>
            )}
            {goalies && (
              <Box>
                <Typography variant="h5" sx={{ marginTop: 4 }}>
                  Goalies
                </Typography>
                <RosterTable items={goalies} team={team} season={season} />
              </Box>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
}

export default TeamProfile;