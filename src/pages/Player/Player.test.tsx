import React from 'react';
import { render, screen } from '@testing-library/react';
import Player from './Player';
import useNetwork from '../../hooks/useNetwork';
import useAlert from '../../hooks/useAlert';
import { useParams } from 'react-router-dom';

jest.mock('../../network/fetchTeam', () => () => null);
jest.mock('../../network/fetchPlayer', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useNetwork');
jest.mock('../../hooks/useAlert');
jest.mock('react-router-dom');

const mockPlayer = {
  captain: false,
  currentAge: 23,
  currentTeam: { id: 3 },
  fullName: 'Derek Sanders',
  height: '6\' 3"',
  id: 1,
  nationality: 'CAN',
  primaryNumber: '24',
  primaryPosition: { name: 'Goalie' },
  rookie: true,
  shootsCatches: 'R',
  weight: 209,
};

it('fetches player, team, and season data', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();
  const fetchPlayer = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { data: null }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { data: null }];
    } else if (key === 'players_request') {
      return [fetchPlayer, { data: { people: [{ currentTeam: { id: 22 } }] } }];
    }
    return [jest.fn(), {}];
  });

  await render(<Player />);

  expect(fetchPlayer).toHaveBeenCalledTimes(1);
  expect(fetchTeam).toHaveBeenCalledTimes(1);
  expect(fetchTeam).toHaveBeenCalledWith(expect.objectContaining({ teamId: 22 }));
  expect(fetchSeason).toHaveBeenCalledTimes(1);
});

it('renders all player data', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();
  const fetchPlayer = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { data: { teams: [{ name: 'Team_Name' }] } }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { data: { seasons: [{ seasonId: '20222023' }] } }];
    } else if (key === 'players_request') {
      return [fetchPlayer, { data: { people: [mockPlayer] } }];
    }
    return [jest.fn(), {}];
  });

  await render(<Player />);

  expect(screen.queryByText(/Team_Name/i)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.currentAge)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.fullName)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.height)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.nationality)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.primaryNumber)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.primaryPosition.name)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.shootsCatches)).toBeInTheDocument();
  expect(screen.queryByText(mockPlayer.weight)).toBeInTheDocument();
});

it('raises alert if errors occur', async () => {
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  (useNetwork as jest.Mock).mockReturnValue([jest.fn(), { error: new Error() }]);

  await render(<Player />);

  expect(raiseAlert).toHaveBeenCalled();
  expect(raiseAlert).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
});
