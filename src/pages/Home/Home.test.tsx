import React from 'react';
import { render, screen } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import useAlert from '../../hooks/useAlert';

jest.mock('@tanstack/react-query');
jest.mock('../../network/fetchTeams', () => () => null);
jest.mock('../../hooks/useAlert');

const mockTeams = [
  {
    id: 1,
    abbreviation: 'ABC',
    name: 'Team_1',
    conference: { id: 11, name: 'Conference_1' },
    division: { id: 111, name: 'Division_1' },
  },
  {
    id: 2,
    abbreviation: 'ABC',
    name: 'Team_2',
    conference: { id: 11, name: 'Conference_1' },
    division: { id: 222, name: 'Division_2' },
  },
  {
    id: 3,
    abbreviation: 'ABC',
    name: 'Team_3',
    conference: { id: 22, name: 'Conference_2' },
    division: { id: 333, name: 'Division_3' },
  },
  {
    id: 4,
    abbreviation: 'ABC',
    name: 'Team_4',
    conference: { id: 22, name: 'Conference_2' },
    division: { id: 444, name: 'Division_4' },
  },
  {
    id: 5,
    abbreviation: 'ABC',
    name: 'Team_5',
    conference: { id: 22, name: 'Conference_2' },
    division: { id: 444, name: 'Division_4' },
  },
  {
    id: 6,
    abbreviation: 'ABC',
    name: 'Team_6',
    conference: { id: 11, name: 'Conference_1' },
    division: { id: 111, name: 'Division_1' },
  },
];

const setup = async () =>
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

beforeEach(() => {
  (useQuery as jest.Mock).mockReturnValue({});
});

it('renders all fetched teams', async () => {
  (useQuery as jest.Mock).mockReturnValue({ data: mockTeams });

  await setup();

  // Make sure each conference and division is only rendered once even though multiple teams belong to them
  expect(await screen.findAllByText(/conference_1/i)).toHaveLength(1);
  expect(await screen.findAllByText(/conference_2/i)).toHaveLength(1);
  expect(await screen.findAllByText(/division_1/i)).toHaveLength(1);
  expect(await screen.findAllByText(/division_2/i)).toHaveLength(1);
  expect(await screen.findAllByText(/division_3/i)).toHaveLength(1);
  expect(await screen.findAllByText(/division_4/i)).toHaveLength(1);

  expect(await screen.findByText(/team_1/i)).toBeInTheDocument();
  expect(await screen.findByText(/team_2/i)).toBeInTheDocument();
  expect(await screen.findByText(/team_3/i)).toBeInTheDocument();
  expect(await screen.findByText(/team_4/i)).toBeInTheDocument();
  expect(await screen.findByText(/team_5/i)).toBeInTheDocument();
  expect(await screen.findByText(/team_6/i)).toBeInTheDocument();
});

it('raises error on network error', async () => {
  const raiseAlert = jest.fn();
  (useAlert as jest.Mock).mockReturnValue(raiseAlert);
  (useQuery as jest.Mock).mockReturnValue({ error: new Error() });

  await setup();

  expect(raiseAlert).toHaveBeenCalledTimes(1);
  expect(raiseAlert).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
});
