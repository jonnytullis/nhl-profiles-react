import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileHeader from './ProfileHeader';

it('renders title and subtitle strings', async () => {
  await render(<ProfileHeader title="My Title" subtitle="My Subtitle" imageUrl="" />);
  expect(screen.queryByText(/my title/i)).toBeInTheDocument();
  expect(screen.queryByText(/my subtitle/i)).toBeInTheDocument();
});

it('renders title and subtitle nodes', async () => {
  await render(<ProfileHeader title={<p>My Title</p>} subtitle={<p>My Subtitle</p>} imageUrl="" />);
  expect(screen.queryByText(/my title/i)).toBeInTheDocument();
  expect(screen.queryByText(/my subtitle/i)).toBeInTheDocument();
});
