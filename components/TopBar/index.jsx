import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

function TopBar({ isLoggedIn, firstName, onLogout }) {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Photo App</Typography>
        {isLoggedIn ? (
          <>
            <Typography variant="h6" style={{ marginLeft: 'auto' }}>
              Hi {firstName}
            </Typography>
            <Button onClick={onLogout} color="inherit">
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="h6" style={{ marginLeft: 'auto' }}>
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
