import React from 'react';
import { AppBar as MUIAppBar, Box, Container, Toolbar, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { GitHub } from '@mui/icons-material';
import SearchField from '../SearchField/SearchField';

export default function AppBar() {
  return (
    <>
      <MUIAppBar>
        <Container maxWidth="xl">
          <Toolbar>
            <Box sx={{ marginBottom: 0.25, marginTop: 0.75, marginRight: 4 }}>
              <Link to="/">
                <Box
                  component="img"
                  alt="NHL Logo"
                  src="https://www-league.nhlstatic.com/images/logos/league-dark/133-flat.svg"
                  sx={{ height: 60, width: 60 }}
                />
              </Link>
            </Box>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              National Hockey League
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <SearchField />
            <IconButton
              color="secondary"
              size="large"
              href="https://github.com/jonnytullis/nhl-profiles-react"
              target="_blank"
            >
              <GitHub />
            </IconButton>
          </Toolbar>
        </Container>
      </MUIAppBar>
      {/* Add spacer to push content below the app bar (since it's absolute positioned) */}
      <Box sx={{ height: 75 }} />
    </>
  );
}
