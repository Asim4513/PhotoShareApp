import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, ImageList, ImageListItem, ImageListItemBar, List, ListItem, ListItemText, Box, TextField, Button, styled } from '@mui/material';
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

const StyledTextField = styled(TextField)({
    margin: '10px 0',
});
  
const StyledButton = styled(Button)({
    backgroundColor: '#6b705c',
    color: 'white',
    '&:hover': {
        backgroundColor: '#495057',
    },
});

function UserPhotos() {
    const { userId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [userName, setUserName] = useState('');
    const [commentText, setCommentText] = useState({});

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

  const handleCommentSubmit = async (photoId) => {
    if (!commentText[photoId]?.trim()) {
        alert('Comment cannot be empty');
        return;
    }

    try {
        // Post the comment to the server
        const response = await axios.post(`/commentsOfPhoto/${photoId}`, {
            comment: commentText[photoId],
        });

        // Fetch the updated photo data for the specific photo
        const updatedPhoto = await axios.get(`/photosOfUser/${userId}`);

        // Update the local state with the new photo data
        const newPhotos = photos.map((photo) => {
            if (photo._id === photoId) {
                const updated = updatedPhoto.data.find((p) => p._id === photoId);
                return updated || photo;
            }
            return photo;
        });

        setPhotos(newPhotos);
        setCommentText({ ...commentText, [photoId]: '' }); // Clear the input field for the photo
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment. Please try again.');
    }
    };


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
                  position="top"
                  sx={{ background: 'linear-gradient(to top, transparent, rgba(0,0,0,0.7))' }}
                />
                <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 1 }}>
                  {photo.comments?.map((comment) => (
                    <StyledListItem key={comment._id}>
                      <ListItemText
                        primary={comment.comment}
                        secondary={
                          <StyledTypography component="span" variant="body2" color="text.primary">
                            {new Date(comment.date_time).toLocaleString()} -{' '}
                            <StyledLink to={`/users/${comment.user._id}`}>
                              {comment.user.first_name} {comment.user.last_name}
                            </StyledLink>
                          </StyledTypography>
                        }
                      />
                    </StyledListItem>
                  ))}
                  <Box sx={{ padding: '10px' }}>
                    <StyledTextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Add a comment..."
                      value={commentText[photo._id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [photo._id]: e.target.value })}
                    />
                    <StyledButton onClick={() => handleCommentSubmit(photo._id)}>Submit</StyledButton>
                  </Box>
                </List>
              </Box>
            </StyledImageListItem>
          ))}
        </StyledImageList>
      );
    }
    
    export default UserPhotos;

  