import React, { useState, useCallback, useEffect } from 'react';
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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Search, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import fetchTeams from '../../network/fetchTeams';
import fetchCurrentSeason from '../../network/fetchCurrentSeason';
import useNetwork from '../../hooks/useNetwork';
import { Team, Season } from '../../types';
import getTeamLogoUrl from '../../utils/getTeamLogoUrl';
import getHeadshotUrl from '../../utils/getHeadshotUrl';

interface Option {
  id: number | string;
  imageUrl?: string;
  text: string;
  href?: string;
}

function SearchResultItem({ option }: { option: Option }): React.ReactElement {
  return (
    <ListItemButton href={option.href ?? ''} disabled={!option.href}>
      {option.imageUrl && (
        <ListItemAvatar>
          <Box component="img" alt="Result Image" src={option.imageUrl} sx={{ width: 40, height: 40 }} />
        </ListItemAvatar>
      )}
      <Typography>{option.text}</Typography>
    </ListItemButton>
  );
}

export default function SearchField(): React.ReactElement {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popperOpen = Boolean(anchorEl);
  const [executeFetchTeams, { data: teamsData }] = useNetwork<Record<'teams', Team[]>>(fetchTeams);
  const [executeFetchSeason, { data: seasonData }] = useNetwork<Record<'seasons', Season[]>>(fetchCurrentSeason);
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      if (!teamsData) {
        executeFetchTeams({ withRosters: true });
      }
      if (!seasonData) {
        executeFetchSeason();
      }
    },
    [executeFetchTeams, teamsData, executeFetchSeason, seasonData]
  );

  const handleClose = () => {
    setAnchorEl(null);
    setInputValue('');
  };

  const assembleOptions = useCallback(() => {
    if (teamsData && seasonData) {
      const seasonId = seasonData.seasons?.[0]?.seasonId;
      const teams = teamsData.teams ?? [];
      const newOptions: Option[] = [];

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

      setOptions(newOptions);
    }
  }, [seasonData, teamsData]);

  useEffect(() => {
    assembleOptions();
  }, [assembleOptions]);

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
                  renderOption={(props, option) => <SearchResultItem key={option.id} option={option} />}
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
