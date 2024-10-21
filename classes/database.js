const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    async connect() {
        const connection = await mysql.createConnection({
            host: process.env.db_host,
            user: process.env.db_user,
            password: process.env.db_pass,
            database: process.env.db_name,
            port: process.env.db_port
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