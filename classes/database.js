const mysql = require('mysql2/promise');

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

module.exports = Database;