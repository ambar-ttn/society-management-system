const {Pool} = require("pg");
require("dotenv").config() ; 

const pool = new Pool({
    connectionString:process.env.DB_URL
})

module.exports=pool;



// pool == used to manage group of db connections 
/*
default max connections = 10

Backend me kya hota hai
Jab tu likhta hai:

pool.query("SELECT * FROM users")

Under the hood:

Pool check karta hai:
koi free connection hai?
Agar hai:
use karta hai query ke liye
Kaam khatam:
connection wapas pool me

 
Flow (Important samajh le)
Request aayi
   ↓
Pool se connection mila
   ↓
Query chali
   ↓
Result aaya
   ↓
Connection wapas pool me
 Pool kyu use karte hain?

Without pool:

Har request pe new DB connection

Slow + heavy


pool.query() ka output kaisa hota hai?
Jab tu likhta hai:
const result = await pool.query("SELECT * FROM users");
 Ye Promise resolve hoke ek object deta hai

 Output Structure (Important)
{
  rows: [...],        // actual data
  rowCount: number,   // kitni rows aayi
  command: "SELECT",  // kaunsi query thi
}
🔍 Example samajh
Table:
id	name
1	Ambar
2	Ravi
Code:
const result = await pool.query("SELECT * FROM users");
console.log(result);
Output:
{
  rows: [
    { id: 1, name: "Ambar" },
    { id: 2, name: "Ravi" }
  ],
  rowCount: 2,
  command: "SELECT"
}




*/