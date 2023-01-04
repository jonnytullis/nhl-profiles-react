import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useQuery, QueryOptions } from '@tanstack/react-query';
import TeamProfile from './TeamProfile';
import useAlert from '../../hooks/useAlert';
import { PositionType } from '../../types';

jest.mock('@tanstack/react-query');
jest.mock('../../network/fetchTeam', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useAlert');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

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

const mockTeam = {
  id: 123,
  name: 'Mattress Cats',
  roster: {
    roster: mockRoster,
  },
};

it('renders team and roster data from network request', async () => {
  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.[0] === 'team_query' && queryKey?.[1] === '123') {
      return { data: mockTeam };
    } else if (queryKey?.[0] === 'current_season') {
      return { data: { seasonId: '12' } };
    }
    return {};
  });

  await render(<TeamProfile />);

  await waitFor(() => {
    expect(screen.queryByText(/mattress cats/i)).toBeInTheDocument();

    mockRoster.forEach((rosterItem) => {
      expect(screen.queryByText(rosterItem.jerseyNumber)).toBeInTheDocument();
      expect(screen.queryByText(rosterItem.person.fullName)).toBeInTheDocument();
      expect(screen.queryByText(rosterItem.position.name)).toBeInTheDocument();
    });
  });
});

it('raises error when fetching team', async () => {
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);

  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.[0] === 'team_query' && queryKey?.[1] === '123') {
      return { error: new Error() };
    } else if (queryKey?.[0] === 'current_season') {
      return { data: null };
    }
    return {};
  });

  await render(<TeamProfile />);

  expect(raiseAlert).toHaveBeenCalledTimes(1);
  expect(raiseAlert).toHaveBeenCalledWith(
    expect.objectContaining({ severity: 'error', message: expect.stringContaining('team') })
  );
});

it('raises error when fetching season', async () => {
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);

  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.[0] === 'team_query' && queryKey?.[1] === '123') {
      return { data: null };
    } else if (queryKey?.[0] === 'current_season') {
      return { error: new Error() };
    }
    return {};
  });

  await render(<TeamProfile />);

  expect(raiseAlert).toHaveBeenCalledTimes(1);
  expect(raiseAlert).toHaveBeenCalledWith(
    expect.objectContaining({ severity: 'error', message: expect.stringContaining('season') })
  );
});
