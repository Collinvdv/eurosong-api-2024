// Importeren van de express module in node_modules
const express = require('express');

// Aanmaken van een express app
const app = express();

// Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Starten van de server en op welke port de server moet luisteren
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
