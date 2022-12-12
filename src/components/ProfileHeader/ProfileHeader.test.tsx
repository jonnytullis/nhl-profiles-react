import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileHeader from './ProfileHeader';

it('renders title and subtitle', async () => {
  await render(<ProfileHeader title="My Title" subtitle="My Subtitle" imageUrl="" />);
  expect(screen.queryByText(/my title/i)).toBeInTheDocument();
  expect(screen.queryByText(/my subtitle/i)).toBeInTheDocument();
});
