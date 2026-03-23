import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;


// pg is a package used to connect my server and database (postgresql) 

