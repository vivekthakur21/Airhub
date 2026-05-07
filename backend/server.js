require('dotenv').config();
const express = require('express');
const app = require('./app');
const connectDB = require('./config/db');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();




// Set static folder (path goes up from backend/ to project root, then into Frontend/dist)
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
