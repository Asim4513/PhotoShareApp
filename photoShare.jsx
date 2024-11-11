import React from "react";
import ReactDOM from "react-dom/client";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';


import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

function UserDetailWrapper() {
  const { userId } = useParams();
  console.log("UserDetail loading for ID:", userId);
  return <UserDetail userId={userId} />;
}

function UserPhotosWrapper() {
  const { userId } = useParams();  
  console.log("UserPhotos loading for ID:", userId);
  return <UserPhotos userId={userId} />;
}

function PhotoShare() {
  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/" element={<Navigate replace to="/users" />} />
                <Route path="/users" element={<Typography>Select a user</Typography>} />
                <Route path="/users/:userId" element={<UserDetailWrapper />} />
                <Route path="/photos/:userId" element={<UserPhotosWrapper />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);

