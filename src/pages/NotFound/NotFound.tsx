import React from 'react';
import { Grid } from '@mui/material';

export default function NotFound(): React.ReactElement {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <h1>Sorry, the page you&apos;re looking for doesn&apos;t exist</h1>
      </Grid>
    </Grid>
  );
}
