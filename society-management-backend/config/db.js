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
// db host is --> addresss of the db server ( db kis machine pe chlra is case mei to mere hi computer pe hai)
//Har server ek specific port par listen karta hai. (to yeh db server ka port number hai )  Database server port 5432 par requests accept kar raha hai


