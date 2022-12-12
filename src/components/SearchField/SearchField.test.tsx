import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchField from './SearchField';
import useNetwork from '../../hooks/useNetwork';
import useAlert from '../../hooks/useAlert';

jest.mock('../../network/fetchTeams', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useNetwork');
jest.mock('../../hooks/useAlert');

const mockTeams = [
  { id: 1, name: 'Mattress Cats', roster: { roster: [{ person: { id: 11, fullName: 'Jeremy Carson' } }] } },
  { id: 2, name: 'Catalina Corndogs', roster: { roster: [{ person: { id: 22, fullName: 'Jason Maj' } }] } },
  { id: 3, name: 'Pink Panthers', roster: { roster: [{ person: { id: 33, fullName: 'Mark Cheney' } }] } },
];

it('fetches teams and current season on click', async () => {
  const fetchTeams = jest.fn();
  const fetchSeasons = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeams, { data: null }];
    } else if (key === 'seasons_request') {
      return [fetchSeasons, { data: null }];
    }
    return [jest.fn(), {}];
  });

  await render(<SearchField />);

  expect(fetchTeams).toHaveBeenCalledTimes(0);
  expect(fetchSeasons).toHaveBeenCalledTimes(0);

  const button = screen.getByRole('button');
  await act(async () => {
    await userEvent.click(button);
  });

  expect(fetchTeams).toHaveBeenCalledTimes(1);
  expect(fetchSeasons).toHaveBeenCalledTimes(1);
});

it('renders teams and players in search results from network requests', async () => {
  const fetchTeams = jest.fn();
  const fetchSeasons = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeams, { data: { teams: mockTeams } }];
    } else if (key === 'seasons_request') {
      return [fetchSeasons, { data: { seasons: [{ seasonId: 44 }] } }];
    }
    return [jest.fn(), {}];
  });

  await render(<SearchField />);

  await act(async () => {
    const button = screen.getByRole('button');
    await userEvent.click(button);
  });

  await act(async () => {
    const textField = await screen.findByPlaceholderText(/search/i);
    await userEvent.type(textField, 'ma');
  });

  await waitFor(() => {
    expect(screen.queryByText(/mark cheney/i)).toBeInTheDocument();
    expect(screen.queryByText(/mattress cats/i)).toBeInTheDocument();
    expect(screen.queryByText(/jason maj/i)).toBeInTheDocument();
    expect(screen.queryByText(/jeremy carson/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/catalina corndogs/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pink panthers/i)).not.toBeInTheDocument();
  });
});

it('renders error message on network error', async () => {
  const fetchTeams = jest.fn();
  const fetchSeasons = jest.fn();
  (useNetwork as jest.Mock).mockImplementation((key) => {
    if (key === 'teams_request') {
      return [fetchTeams, { error: new Error() }];
    } else if (key === 'seasons_request') {
      return [fetchSeasons, { data: null }];
    }
    return [jest.fn(), {}];
  });

  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);

  await render(<SearchField />);

  expect(fetchTeams).toHaveBeenCalledTimes(0);
  expect(fetchSeasons).toHaveBeenCalledTimes(0);

  const button = screen.getByRole('button');
  await act(async () => {
    await userEvent.click(button);
  });

  expect(fetchTeams).toHaveBeenCalledTimes(1);
  expect(fetchSeasons).toHaveBeenCalledTimes(1);

  expect(raiseAlert).toHaveBeenCalled();
  expect(raiseAlert).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
});
