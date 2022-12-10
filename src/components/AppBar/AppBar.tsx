import React from 'react';
import { AppBar as MUIAppBar, Box, Container, Link, Toolbar, Typography } from '@mui/material';

export default function AppBar() {
  return (
    <>
      <MUIAppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar>
            <Link href="/" sx={{ marginBottom: 0.25, marginTop: 0.75, marginRight: 4 }}>
              <Box
                component="img"
                alt="NHL Logo"
                src="https://www-league.nhlstatic.com/images/logos/league-dark/133-flat.svg"
                sx={{ height: 60, width: 60 }}
              />
            </Link>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              National Hockey League
            </Typography>
          </Toolbar>
        </Container>
      </MUIAppBar>
    </>
  );
}
