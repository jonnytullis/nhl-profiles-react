import React from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';

interface Props {
  imageUrl: string;
  roundImage?: boolean;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
}

export default function ProfileHeader({ imageUrl, title, subtitle, roundImage }: Props): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container direction="column" alignItems="center">
      <Box
        component="img"
        alt="Profile Logo"
        src={imageUrl}
        draggable={false}
        sx={{
          width: 200,
          height: 200,
          borderRadius: roundImage ? '50%' : undefined,
          border: roundImage ? '1px solid #aaa' : undefined,
        }}
      />
      <Typography variant={isMobile ? 'h4' : 'h2'} textAlign="center">
        {title}
      </Typography>
      <Typography variant={isMobile ? 'subtitle1' : 'h5'} textAlign="center">
        {subtitle}
      </Typography>
    </Grid>
  );
}
