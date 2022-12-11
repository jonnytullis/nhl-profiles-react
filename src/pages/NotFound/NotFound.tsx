import React from 'react';
import { Container, Grid, Typography } from '@mui/material';

function NotFound(): React.ReactElement {
  return (
    <Container sx={{ paddingY: 3 }}>
      <Grid container alignItems="center" direction="column">
        <Typography variant="h1">404</Typography>
        <Typography variant="h4" textAlign="center">
          Sorry, the page you&apos;re looking for doesn&apos;t exist
        </Typography>
      </Grid>
    </Container>
  );
}

export default NotFound;
