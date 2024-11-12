# 📸 Photo Share App (Project 6)

![Node.js](https://img.shields.io/badge/Node.js-v16+-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-v5+-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

The **Photo Share App** is a full-stack web application built with Node.js, Express, and MongoDB. It allows users to share photos, view user details, and display comments on photos. This project extends previous versions by integrating MongoDB for persistent data storage, making it a complete full-stack application.

## 🌟 Features

- Display a list of users with basic details (first name, last name).
- View detailed information for individual users.
- Display all photos uploaded by a specific user, including comments.
- Store and retrieve data using MongoDB and Mongoose.
- Comprehensive backend testing with Mocha.
- Error handling for invalid or missing data.

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Testing**: Mocha
- **Linting**: ESLint

## ⚙️ Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js** (version 16 or later)
- **MongoDB** (version 5.0 or later)
- **npm** (Node Package Manager)

## 🚀 Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/photoshare-app.git
   cd photoshare-app
   
2. **Install Dependencies**:
   ```bash
   npm install

3. **Start MongoDB**:
   ```bash
   mongod

4. **Load Database**:
   ```bash
   node loadDatabase.js

5. **RUN the Webserver**:
   ```bash
   node webServer.js


The app will be running at http://localhost:3000.

