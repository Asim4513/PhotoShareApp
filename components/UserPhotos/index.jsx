import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, ImageList, ImageListItem, ImageListItemBar, List, ListItem, ListItemText, Box, styled } from '@mui/material';
import axios from 'axios';

const StyledImageList = styled(ImageList)({
  marginBottom: '20px',  
});

const StyledImageListItem = styled(ImageListItem)({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',  
});

const StyledImageListItemBar = styled(ImageListItemBar)({
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',  
});

const StyledTypography = styled(Typography)({
  fontFamily: '"Courier New", Courier, monospace', 
  color: '#6b705c',  
});

const StyledListItem = styled(ListItem)({
  backgroundColor: '#ffe8d6',  
  '&:hover': {
      backgroundColor: '#e4e4e4',  
  }
});

const StyledLink = styled(RouterLink)({
  textDecoration: 'none',  
  color: '#6b705c',  
});


function UserPhotos() {
    const { userId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
      async function fetchPhotosAndUser() {
          try {
              
              const userResult = await axios.get(`/user/${userId}`);
              if (userResult && userResult.data) {
                  setUserName(`${userResult.data.first_name} ${userResult.data.last_name}`);
              }

              
              const photosResult = await axios.get(`/photosOfUser/${userId}`);
              if (photosResult && photosResult.data) {
                  setPhotos(photosResult.data.map(photo => ({
                      ...photo,
                      comments: photo.comments || []  
                  })));
              }
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      }

      fetchPhotosAndUser();
  }, [userId]); 

    if (!photos.length) {
        return <Typography>No photos found for {userName}.</Typography>;
    }

    return (
        <StyledImageList cols={3} gap={15}>
            {photos.map((photo) => (
                <StyledImageListItem key={photo._id}>
                    <img 
                        src={`../../images/${photo.file_name}`}
                        alt={`Taken on ${new Date(photo.date_time).toLocaleDateString()}`}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                        <StyledImageListItemBar
                            title={`Photo taken on ${new Date(photo.date_time).toLocaleDateString()}`}
                            subtitle={<span>by: {userName}</span>}
                            position="top" // Changed to top
                            sx={{ background: 'linear-gradient(to top, transparent, rgba(0,0,0,0.7))' }} 
                        />
                        <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 1 }}>
                            {photo.comments?.map((comment) => (
                                <StyledListItem key={comment._id}>
                                    <ListItemText
                                        primary={comment.comment}
                                        secondary={(
                                            <StyledTypography component="span" variant="body2" color="text.primary">
                                                {new Date(comment.date_time).toLocaleString()} - 
                                                <StyledLink to={`/users/${comment.user._id}`}>
                                                    {comment.user.first_name} {comment.user.last_name}
                                                </StyledLink>
                                            </StyledTypography>
                                        )}
                                    />
                                </StyledListItem>
                            ))}
                        </List>
                    </Box>
                </StyledImageListItem>
            ))}
        </StyledImageList>
    );
}

export default UserPhotos;
