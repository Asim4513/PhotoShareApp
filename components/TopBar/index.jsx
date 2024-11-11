import React, { useEffect, useState, useMemo } from 'react';
import { AppBar, Toolbar, Typography, styled } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#6b705c', 
  color: '#ffe8d6', 
  boxShadow: 'none', 
  justifyContent: 'center', 
  height: 60
});

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between', 
  padding: '0 20px'
});

const TitleTypography = styled(Typography)({  
  fontFamily: '"Courier New", Courier, monospace', 
  fontWeight: 'bold'
});

function TopBar() {
    const location = useLocation();
    const [userName, setUserName] = useState('');

    useEffect(() => {
      let isMounted = true;
  
      async function fetchUserName(userId) {
        try {
            const result = await axios.get(`/user/${userId}`);
            if (isMounted && result.data) {
                setUserName(`${result.data.first_name} ${result.data.last_name}`);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
      }
  
      const pathParts = location.pathname.split('/');
    
      if (pathParts[1] === 'users' && pathParts[2]) {
          fetchUserName(pathParts[2]);
      } else if (pathParts[1] === 'photos' && pathParts[2]) {
          fetchUserName(pathParts[2]);
      } else {
          setUserName('');
      }
  
      return () => {
          isMounted = false; 
      };
    }, [location.pathname]);
  

    
    const title = useMemo(() => {
        if (location.pathname.startsWith('/users/') && userName) {
            return userName;
        } else if (location.pathname.startsWith('/photos/') && userName) {
            return `Photos of ${userName}`;
        }
        return 'Welcome';
    }, [location.pathname, userName]);

    return (
        <StyledAppBar position="static">
            <StyledToolbar>
                <TitleTypography variant="h6">Asim Abdul Bari</TitleTypography>
                <Typography variant="h6" style={{ marginLeft: 'auto' }}>
                    {title}
                </Typography>
            </StyledToolbar>
        </StyledAppBar>
    );
}

export default TopBar;
