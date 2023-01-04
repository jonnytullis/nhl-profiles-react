import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useQuery, QueryOptions } from '@tanstack/react-query';
import SearchField from './SearchField';
import useAlert from '../../hooks/useAlert';

jest.mock('@tanstack/react-query');
jest.mock('../../network/fetchTeams', () => () => null);
jest.mock('../../network/fetchCurrentSeason', () => () => null);
jest.mock('../../hooks/useAlert');

const mockTeams = [
  { id: 1, name: 'Mattress Cats', roster: { roster: [{ person: { id: 11, fullName: 'Jeremy Carson' } }] } },
  { id: 2, name: 'Catalina Corndogs', roster: { roster: [{ person: { id: 22, fullName: 'Jason Maj' } }] } },
  { id: 3, name: 'Pink Panthers', roster: { roster: [{ person: { id: 33, fullName: 'Mark Cheney' } }] } },
];

const setup = async () =>
  render(
    <BrowserRouter>
      <SearchField />
    </BrowserRouter>
  );

beforeEach(() => {
  (useQuery as jest.Mock).mockReturnValue({});
});

it('renders search field on search button click', async () => {
  await setup();

  let textField = screen.queryByPlaceholderText(/search/i);
  expect(textField).toBeNull();

  const button = screen.getByRole('button');
  await act(async () => {
    await userEvent.click(button);
  });

  textField = screen.queryByPlaceholderText(/search/i);
  expect(textField).toBeDefined();
});

it('renders teams and players in search results from network requests', async () => {
  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.includes('teams_with_rosters')) {
      return { data: mockTeams };
    }
    if (queryKey?.includes('current_season')) {
      return { data: { seasonId: 'season_id' } };
    }
  });

  await setup();

  await act(async () => {
    const button = screen.getByRole('button');
    await userEvent.click(button);
  });

  await act(async () => {
    const textField = await screen.findByPlaceholderText(/search/i);
    await userEvent.type(textField, 'ma');
  });

  expect(screen.queryByText(/mark cheney/i)).toBeInTheDocument();
  expect(screen.queryByText(/mattress cats/i)).toBeInTheDocument();
  expect(screen.queryByText(/jason maj/i)).toBeInTheDocument();
  expect(screen.queryByText(/jeremy carson/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/catalina corndogs/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/pink panthers/i)).not.toBeInTheDocument();
});

it('renders error message on network error', async () => {
  (useQuery as jest.Mock).mockImplementation(({ queryKey }: QueryOptions) => {
    if (queryKey?.includes('teams_with_rosters')) {
      return { error: new Error() };
    }
    if (queryKey?.includes('current_season')) {
      return { data: null };
    }
  });

  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockImplementation(() => raiseAlert);

  await setup();

  const button = screen.getByRole('button');
  await act(async () => {
    await userEvent.click(button);
  });

  expect(raiseAlert).toHaveBeenCalled();
  expect(raiseAlert).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
});
