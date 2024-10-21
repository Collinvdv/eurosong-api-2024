// Importeren van de express module in node_modules
const express = require('express');
const mysql = require('mysql2/promise');

// Aanmaken van een express app
const app = express();

class Database {
    async connect() {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'EurosongDB',
            port: 8889
        });

        return connection;
    }

    async getQuery(sql, params) {
        const connection = await this.connect();
        const [ rows ] = await connection.execute(sql, params);

        return rows;
    }
}

const db = new Database();
db.getQuery('SELECT * FROM artists').then((rows) => {
    console.log(rows);
});

// Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/artists', (req, res) => {
    res.send([
        "JB",
        "Beyonce",
    ]);
});

// Starten van de server en op welke port de server moet luistere
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
