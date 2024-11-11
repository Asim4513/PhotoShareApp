import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Button, styled } from '@mui/material';
import axios from 'axios';


const DetailContainer = styled('div')({
  padding: '20px',
  backgroundColor: '#f5f5f5',  
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
});

const StyledTypography = styled(Typography)({
  color: '#6b705c',  
  fontFamily: '"Courier New", Courier, monospace', 
});

const StyledButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#cb997e',  
  '&:hover': {
      backgroundColor: '#b7b7a4', 
  }
});

const StyledLink = styled(RouterLink)({
  textDecoration: 'none',  
  color: 'inherit',  
});

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        async function fetchUser() {
          const result = await axios.get(`/user/${userId}`);
          setUser(result.data);
        }
        fetchUser();
    }, [userId]);


    if (!user) {
        return <StyledTypography variant="body1">Loading user details...</StyledTypography>;
    }

    return (
          <DetailContainer>
            <StyledTypography variant="h4" gutterBottom>User Details</StyledTypography>
            <StyledTypography variant="body1">Full Name: {user.first_name} {user.last_name}</StyledTypography>
            <StyledTypography variant="body1">Location: {user.location}</StyledTypography>
            <StyledTypography variant="body1">Description: {user.description}</StyledTypography>
            <StyledTypography variant="body1">Occupation: {user.occupation}</StyledTypography>
            <StyledButton variant="contained" color="secondary" component={StyledLink} to={`/photos/${userId}`}>
                View Photos
            </StyledButton>
          </DetailContainer>
    );
}

export default UserDetail;
