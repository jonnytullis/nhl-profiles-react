import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function Team(): React.ReactElement {
  const { id } = useParams();
  return <Typography variant="h1">Team page for id: {id}</Typography>;
}
