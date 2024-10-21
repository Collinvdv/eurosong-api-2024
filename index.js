// Importeren van de express module in node_modules
const express = require('express');
const Database = require('./classes/database.js');

// Aanmaken van een express app
const app = express();

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

// Starten van de server en op welke port de server moet luistere
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
