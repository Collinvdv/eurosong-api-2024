// Importeren van de express module in node_modules
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./classes/database.js');

// Aanmaken van een express app
const app = express();

// Middleware om JSON-requests te parsen
app.use(bodyParser.json());

// Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/artists', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM artists').then((artists) => {
        res.send(artists);
    });
});

app.get('/api/votes', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM votes').then((votes) => {
        res.send(votes);
    });
});

app.get('/api/songs', (req, res) => {
    const db = new Database();
    db.getQuery(`
        SELECT
            song_id, s.name AS songname, a.name AS artistname
        FROM
            songs AS s
                INNER JOIN
                    artists AS a
                        ON
                            s.artist_id = a.artist_id;
    `).then((songs) => {
        res.send(songs);
    });
});

app.get('/api/ranking', (req, res) => {
    const db = new Database();
    db.getQuery(`
        SELECT songs.song_id, songs.name AS song_name, artists.name AS artist_name, SUM(points) AS total_points
        FROM
            votes
                INNER JOIN
                    songs
                        ON songs.song_id = votes.song_id
                INNER JOIN
                    artists
                        ON songs.artist_id = artists.artist_id
        GROUP BY song_id
        ORDER BY SUM(points) DESC;
    `).then((ranking) => {
        res.send(ranking);
    });
});

app.post('/api/artists', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO artists (name) VALUES (?)', [name])
        .then(() => res.status(201).send({ message: 'Artist added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add artist', details: error }));
});

app.post('/api/songs', (req, res) => {
    const { name, artist_id } = req.body;
    const db = new Database();
    db.getQuery('INSERT INTO songs (name, artist_id) VALUES (?, ?)', [name, artist_id])
        .then(() => res.status(201).send({ message: 'Song added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add song', details: error }));
});

// POST endpoint om een nieuwe stem toe te voegen
app.post('/api/votes', (req, res) => {
    const { song_id, points } = req.body;
    const db = new Database();
    db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [song_id, points])
        .then(() => res.status(201).send({ message: 'Vote added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add vote', details: error }));
});

// Starten van de server en op welke port de server moet luistere
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
