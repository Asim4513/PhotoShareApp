import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './styles.css';

function TopBar({ isLoggedIn, firstName, onLogout }) {
  return (
    <AppBar position="static" className="topbar-appBar">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" className="topbar-title">
          Photo App
        </Typography>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <Typography variant="h6" style={{ marginRight: '15px' }}>
              Hi {firstName}
            </Typography>
            <Button onClick={onLogout} color="inherit">
              Logout
            </Button>
          </div>
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
