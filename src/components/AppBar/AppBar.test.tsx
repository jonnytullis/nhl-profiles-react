import React from 'react';
import { render, screen } from '@testing-library/react';
import AppBar from './AppBar';

// eslint-disable-next-line react/display-name
jest.mock('../SearchField/SearchField', () => () => <div>Mock Search Field</div>);

it('renders component', async () => {
  await render(<AppBar />);
  expect(screen.queryByText(/national hockey league/i)).toBeInTheDocument();
  expect(screen.queryByText(/mock search field/i)).toBeInTheDocument();
});
