import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

function AppAppBar() {
  return (
    <div>
      <MuiAppBar elevation={0} position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24 }}
          >
            {'Messaging Web Application'}
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              variant="h6"
              underline="none"
              href="/sign-in"
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Accedi'}
            </Link>
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
