import React, { useState } from "react";
import { Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './styles.css';

function LoginRegister({ onLogin }) {
  // Hooks to store login/registration info
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Used to change url upon login
  const navigate = useNavigate();

  // Function to log the user into the application
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/admin/login", { login_name: loginName, password });
      if (response.status === 200) {
        const { first_name, user_id } = response.data;
        onLogin(first_name, user_id);
        navigate("/users");
      }
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  // Function to create a user
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
        location: location,
        description: description,
        occupation: occupation,
      });

      console.log(response);

      setError("");
      alert("Registration successful! You can now log in."); // eslint-disable-line no-alert
      setIsRegistering(false);

    } catch (err) {
      setError("Registration failed: " + err.response.data);
    }
  };

  return (
    <Paper className="login-register-container">
      {isRegistering ? (
        <>
          <Typography variant="h6" className="form-title">Register</Typography>
          <TextField
            className="form-group"
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Login Name"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Occupation"
            fullWidth
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            required
          />
          {error && <Typography className="error-message">{error}</Typography>}
          <Button onClick={handleRegister} variant="contained" color="primary" className="form-button">
            Register Me
          </Button>
          <Button onClick={() => setIsRegistering(false)} className="form-button">Back to Login</Button>
        </>
      ) : (
        <>
          <Typography variant="h6" className="form-title">Login</Typography>
          <TextField
            className="form-group"
            label="Login Name"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            className="form-group"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography className="error-message">{error}</Typography>}
          <Button onClick={handleLogin} variant="contained" color="primary" className="form-button">
            Login
          </Button>
          <Button onClick={() => setIsRegistering(true)} className="form-button">Create an Account</Button>
        </>
      )}
    </Paper>
  );
}

export default LoginRegister;
