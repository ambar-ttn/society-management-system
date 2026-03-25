import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;






/* 


import pg from "pg" Ye pg library import kar raha hai.
pg = Node.js PostgreSQL client
Isse Node.js → PostgreSQL database se connect karta hai.

rary mein do main cheeze hoti hain:

Client
Pool
Client

Ek connection banata hai → query → close

Pool

Multiple reusable connections → fast → production use

Isliye hum Pool use karte hain.


Sabse Pehle — SSL kya hota hai?

SSL = Secure Socket Layer

Simple:

SSL connection ko encrypt karta hai taaki data safe rahe internet par.

Matlab:

Without SSL:
App → username/password → Internet → DB
(Hacker dekh sakta hai)

With SSL:
App → encrypted data → Internet → DB
(Hacker nahi padh sakta)
SSL Kab Use Hota Hai?
2 Situations:
1. Local Database (localhost)
localhost → SSL nahi chahiye
2. Cloud Database (Neon, Supabase, AWS, Railway)
Internet ke through connect ho rahe ho → SSL required

Isliye jab tum Neon PostgreSQL use kar rahe the, tab SSL lagana padta hai.

Tumhara Code Samjho
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

Matlab:

DB URL se connect karo
SSL secure connection use karo
Certificate strict verify mat karo
rejectUnauthorized: false kya karta hai?

Thoda technical hai but simple samjho:

Jab SSL connection banta hai, server certificate deta hai.
Node.js normally check karta hai:
Certificate trusted hai ya nahi?

Agar trusted nahi → connection reject

To avoid error:

rejectUnauthorized: false

Matlab:

Certificate verify mat karo, connection allow kar do.
Ye mostly cloud DB mein use hota hai.

Agar SSL na lagao to error aata hai
Common error:

Error: self signed certificate
SSL required
no pg_hba.conf entry for host

Isliye cloud PostgreSQL mein ye likhte hain.

SSL mein actually hota kya hai?

Jab tum server (database) se SSL connection banate ho, server tumhe certificate deta hai.

Phir Node.js check karta hai:

Certificate valid hai?
Trusted authority ne sign kiya hai?
Expired to nahi?
Domain match karta hai?

Agar sab sahi → connection allowed
Agar nahi → connection reject

Problem Cloud Databases mein

Bahut cloud databases (Neon, Supabase, Railway etc.) self-signed certificate use karte hain.

Self-signed certificate matlab:

Certificate trusted authority ne sign nahi kiya, server ne khud banaya.

Isliye Node.js bolta:

Certificate trusted nahi hai → connection reject

To error aata:

self signed certificate
unable to verify first certificate
Isliye hum likhte hain:
ssl: {
  rejectUnauthorized: false
}

Matlab:

Mujhe pata hai certificate trusted authority ka nahi hai, phir bhi connection allow karo.

Simple Analogy

Socho building mein guard hai.

Situation	Meaning
Trusted ID	Entry allowed
Unknown ID	Entry denied
rejectUnauthorized false	Guard bol raha: jaane do, main jaanta hoon isko

*/