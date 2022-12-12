import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamProfile from './TeamProfile';
import useNetwork from '../../hooks/useNetwork';
import useAlert from '../../hooks/useAlert';
import { useParams } from 'react-router-dom';
import { PositionType } from '../../types';

jest.mock('../../network/fetchTeam', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useNetwork');
jest.mock('../../hooks/useAlert');
jest.mock('react-router-dom');

const mockRoster = [
  {
    person: { id: 1, fullName: 'Jeremy Carson' },
    jerseyNumber: '11',
    position: { type: PositionType.defenseman, name: 'defense_1' },
  },
  {
    person: { id: 2, fullName: 'Jimmy Fallon' },
    jerseyNumber: '22',
    position: { type: PositionType.defenseman, name: 'defense_2' },
  },
  {
    person: { id: 3, fullName: 'Led Zeppelin' },
    jerseyNumber: '33',
    position: { type: PositionType.goalie, name: 'goalie_1' },
  },
  {
    person: { id: 4, fullName: 'The Beatles' },
    jerseyNumber: '44',
    position: { type: PositionType.goalie, name: 'forward_1' },
  },
];

const mockTeams = [
  {
    id: 1,
    name: 'Mattress Cats',
    roster: {
      roster: mockRoster,
    },
  },
];

it('fetches team data with teamId param', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { data: null }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { data: null }];
    }
    return [jest.fn(), {}];
  });

  await render(<TeamProfile />);

  expect(fetchTeam).toHaveBeenCalledTimes(1);
  expect(fetchTeam).toHaveBeenCalledWith(expect.objectContaining({ teamId: '123' }));
  expect(fetchSeason).toHaveBeenCalledTimes(1);
});

it('renders team and roster data from network request', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { data: { teams: mockTeams } }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { data: { seasons: [{ seasonId: '12' }] } }];
    }
    return [jest.fn(), {}];
  });

  await render(<TeamProfile />);

  expect(screen.queryByText(/mattress cats/i)).toBeInTheDocument();

  mockRoster.forEach((rosterItem) => {
    expect(screen.queryByText(rosterItem.jerseyNumber)).toBeInTheDocument();
    expect(screen.queryByText(rosterItem.person.fullName)).toBeInTheDocument();
    expect(screen.queryByText(rosterItem.position.name)).toBeInTheDocument();
  });
});

it('raises error when fetching team', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();

  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { error: new Error() }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { data: null }];
    }
    return [jest.fn(), {}];
  });

  await render(<TeamProfile />);

  expect(raiseAlert).toHaveBeenCalledTimes(1);
  expect(raiseAlert).toHaveBeenCalledWith(
    expect.objectContaining({ severity: 'error', message: expect.stringContaining('team') })
  );
});

it('raises error when fetching season', async () => {
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);
  const fetchTeam = jest.fn();
  const fetchSeason = jest.fn();

  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeam, { data: null }];
    } else if (key === 'seasons_request') {
      return [fetchSeason, { error: new Error() }];
    }
    return [jest.fn(), {}];
  });

  await render(<TeamProfile />);

  expect(raiseAlert).toHaveBeenCalledTimes(1);
  expect(raiseAlert).toHaveBeenCalledWith(
    expect.objectContaining({ severity: 'error', message: expect.stringContaining('season') })
  );
});
