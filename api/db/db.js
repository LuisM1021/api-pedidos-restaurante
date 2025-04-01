const pg = require('pg');

const { Pool } = pg;

// const dbURI = 'postgres://user:password@host:port/dbName';
const dbURI = 'postgres://luis:admin@localhost:5435/db_test';

const pool = new Pool({
    connectionString: dbURI,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;