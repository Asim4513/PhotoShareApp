import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Grid, Paper, Typography } from "@mui/material";
import { HashRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

function UserDetailWrapper() {
  const { id } = useParams();
  console.log("UserDetail loading for ID:", id);
  return <UserDetail userId={id} />;
}

function UserPhotosWrapper() {
  const { id } = useParams();  
  console.log("UserPhotos loading for ID:", id);
  return <UserPhotos userId={id} />;
}

function PhotoShare() {
  const [login, setLogin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [userId, setUserId] = useState(null);

  const handleLogin = (fName, id) => {
    setLogin(true);
    setFirstName(fName);
    setUserId(id);
  };

  const handleLogout = async () => {
    const response = await fetch("/admin/logout", { method: "POST" });
    if (response.ok) {
      setLogin(false);
      setFirstName("");
      setUserId(null);

      console.log("User logging out: " + userId);
    } else {
      alert("Logout failed"); // eslint-disable-line no-alert
    }
  };

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar isLoggedIn={login} firstName={firstName} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {login ? <UserList /> : null} {/* Show UserList only when logged in */}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                {/* Redirect based on login state */}
                <Route path="/" element={login ? <Navigate to="/users" /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
                <Route path="/users" element={login ? <Typography>Select a user</Typography> : <Navigate to="/login" />} />
                <Route path="/users/:userId" element={login ? <UserDetailWrapper /> : <Navigate to="/login" />} />
                <Route path="/photos/:userId" element={login ? <UserPhotosWrapper />: <Navigate to="/login" />} />
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
