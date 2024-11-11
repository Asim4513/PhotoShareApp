import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, styled } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const StyledList = styled(List)({
  backgroundColor: '#f5f5f5',  
  borderRadius: '5px',  
  margin: '10px 0', 
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  
});

const StyledListItem = styled(ListItem)({
  backgroundColor: '#ffe8d6',  
  marginBottom: '2px', 
  '&:hover': {
      backgroundColor: '#e4e4e4',
  }
});

const StyledLink = styled(RouterLink)({
  textDecoration: 'none',  
  color: '#6b705c',  
  fontWeight: 'bold'
});

const StyledTypography = styled(Typography)({
  color: '#6b705c',  
  padding: '10px 20px', 
  fontFamily: '"Courier New", Courier, monospace', 
});

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      async function fetchUsers() {
        try {
          const result = await axios.get('/user/list');
          setUsers(result.data);
        } catch (error) {
          console.log('Error fetching users:', error);
        }
      }
  
      fetchUsers();
    }, []);
    

    return (
        <div>
            <StyledTypography variant="h6">User List</StyledTypography>
            <StyledList>
                {users.map(user => (
                    <StyledListItem button component={StyledLink} to={`/users/${user._id}`} key={user._id} >
                        <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                    </StyledListItem>
                ))}
            </StyledList>
        </div>
    );
}

export default UserList;
