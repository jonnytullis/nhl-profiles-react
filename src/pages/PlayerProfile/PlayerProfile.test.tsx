import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useQuery, QueryOptions } from '@tanstack/react-query';
import PlayerProfile from './PlayerProfile';
import useAlert from '../../hooks/useAlert';

jest.mock('@tanstack/react-query');
jest.mock('../../network/fetchTeam', () => () => null);
jest.mock('../../network/fetchPlayer', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useAlert');
jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useParams: () => ({ id: '123' }),
}));

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

const mockTeam = {
  name: 'Team_Name',
  id: 3,
};

it('renders player and team data', async () => {
  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.[0] === 'team_query' && queryKey?.[1] === '3') {
      return { data: mockTeam };
    } else if (queryKey?.[0] === 'current_season') {
      return { data: { seasonId: '20222023' } };
    } else if (queryKey?.[0] === 'player_query' && queryKey?.[1] === '123') {
      return { data: mockPlayer };
    }
    return {};
  });

  await render(<PlayerProfile />);

  await waitFor(() => {
    expect(screen.queryByText(mockTeam.name)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.currentAge)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.fullName)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.height)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.nationality)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.primaryNumber)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.primaryPosition.name)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.shootsCatches)).toBeInTheDocument();
    expect(screen.queryByText(mockPlayer.weight)).toBeInTheDocument();
  });
});

it('raises alert if errors occur', async () => {
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);
  (useQuery as jest.Mock).mockReturnValue({ error: new Error() });

  await render(<PlayerProfile />);

  expect(raiseAlert).toHaveBeenCalled();
  expect(raiseAlert).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
});
