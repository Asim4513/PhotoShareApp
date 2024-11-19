import React, { useState } from "react";
import { Button, TextField, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LoginRegister({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/login", { login_name: loginName, password });
      if (response.status === 200) {
        const { first_name, user_id } = response.data;
        onLogin(first_name, user_id); // Update the PhotoShare state
        console.log('logged in')
        navigate("/users"); // Navigate to the UserList route
      }
    } catch (err) {
      setError("Invalid login credentials");
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/user", {
        login_name: loginName,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      setError("");
      alert("Registration successful! You can now log in.");
      setIsRegistering(false);
    } catch (err) {
      setError("Registration failed: " + err.response.data);
    }
  };

  return (
    <Paper style={{ padding: "20px" }}>
      {isRegistering ? (
        <>
          <Typography variant="h6">Register</Typography>
          <TextField
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Login Name"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button onClick={handleRegister} variant="contained" color="primary">
            Register Me
          </Button>
          <Button onClick={() => setIsRegistering(false)}>Back to Login</Button>
        </>
      ) : (
        <>
          <Typography variant="h6">Login</Typography>
          <TextField
            label="Login Name"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button onClick={handleLogin} variant="contained" color="primary">
            Login
          </Button>
          <Button onClick={() => setIsRegistering(true)}>Create an Account</Button>
        </>
      )}
    </Paper>
  );
}

export default LoginRegister;