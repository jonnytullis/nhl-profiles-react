import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  TextField,
  IconButton,
  Typography,
  ListItemAvatar,
  Box,
  Popper,
  Paper,
  ClickAwayListener,
  Fade,
  ListItemButton,
  FilterOptionsState,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Search, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import fetchTeams from '../../network/fetchTeams';
import fetchCurrentSeason from '../../network/fetchCurrentSeason';
import useAlert from '../../hooks/useAlert';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';
import getHeadshotUrl from '../../utils/getHeadshotUrl';

interface Option {
  id: number | string;
  imageUrl?: string;
  text: string;
  href?: string;
}

function SearchResultItem({ option, onClick }: { option: Option; onClick: () => void }): React.ReactElement {
  return (
    <Link to={option.href ?? ''}>
      <ListItemButton disabled={!option.href} onClick={onClick}>
        {option.imageUrl && (
          <ListItemAvatar>
            <Box component="img" alt="Result Image" src={option.imageUrl} sx={{ width: 40, height: 40 }} />
          </ListItemAvatar>
        )}
        <Typography>{option.text}</Typography>
      </ListItemButton>
    </Link>
  );
}

export default function SearchField(): React.ReactElement {
  const theme = useTheme();
  const raiseAlert = useAlert();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const { data: teams, error: teamError } = useQuery({
    queryKey: ['teams_with_rosters'],
    queryFn: () => fetchTeams({ withRosters: true }),
    enabled: popperOpen,
  });
  const { data: season, error: seasonError } = useQuery({
    queryKey: ['current_season'],
    queryFn: fetchCurrentSeason,
    enabled: popperOpen,
  });
  const [inputValue, setInputValue] = useState('');

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  }, []);

  useEffect(() => {
    if (teamError || seasonError) {
      raiseAlert({ message: 'Failed to fetch data for search', severity: 'error' });
    }
  }, [teamError, seasonError, raiseAlert]);

  const handleClose = () => {
    setPopperOpen(false);
    setInputValue('');
  };

  const options: Option[] = useMemo(() => {
    const newOptions: Option[] = [];

    if (teams && season) {
      const seasonId = season.seasonId;

      teams.forEach((team) => {
        newOptions.push({
          id: team.id,
          imageUrl: getTeamLogoUrl(team.id),
          text: team.name,
          href: `/team/${team.id}`,
        });

        team.roster?.roster?.forEach((rosterItem) => {
          const person = rosterItem.person;
          newOptions.push({
            id: person?.id,
            imageUrl: getHeadshotUrl(person?.id, team.abbreviation, seasonId),
            text: person?.fullName,
            href: `/player/${person?.id}`,
          });
        });
      });
    }

    return newOptions;
  }, [season, teams]);

  function filterOptions(optionList: Option[], params: FilterOptionsState<Option>) {
    const firstFilter = createFilterOptions({
      matchFrom: 'any',
      stringify: (option: Option) => option.text,
      limit: 5,
    });

    const filteredItems = firstFilter(optionList, params);
    if (!filteredItems.length) {
      filteredItems.push({ id: 'NO_OPTIONS', text: 'No Results Found' });
    }
    return filteredItems;
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        <IconButton color="secondary" size="large" onClick={popperOpen ? handleClose : handleClick}>
          {!popperOpen && <Search color="secondary" />}
          {popperOpen && <Close color="secondary" />}
        </IconButton>

        <Popper open={popperOpen} anchorEl={anchorEl} placement="left" sx={{ zIndex: theme.zIndex.modal }} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper>
                <Autocomplete
                  inputValue={inputValue}
                  onInputChange={(e, value) => setInputValue(value)}
                  open={!!inputValue}
                  freeSolo
                  options={options}
                  renderInput={(params) => <TextField {...params} placeholder="Search" color="info" autoFocus />}
                  renderOption={(props, option) => (
                    <SearchResultItem key={option.id} option={option} onClick={handleClose} />
                  )}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.text)}
                  filterOptions={filterOptions}
                  sx={{ width: 300, marginY: '-8px' }}
                />
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
