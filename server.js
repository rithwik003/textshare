const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create a new SQLite database
const db = new sqlite3.Database('text.db');

// Create a table for storing the text
db.run(`CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)`);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API endpoint for retrieving the text
app.get('/get-text', (req, res) => {
  db.get('SELECT text FROM texts ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error('Error retrieving text:', err);
      res.status(500).json({ error: 'Error retrieving text' });
    } else {
      res.json({ text: row ? row.text : '' });
    }
  });
});

// API endpoint for saving the text
app.post('/save-text', express.json(), (req, res) => {
  const text = req.body.text;

  db.run('INSERT INTO texts (text) VALUES (?)', [text], function (err) {
    if (err) {
      console.error('Error saving text:', err);
      res.status(500).json({ error: 'Error saving text' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
