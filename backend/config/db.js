import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT), // ✅ VERY IMPORTANT
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log('MySQL Connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  });

export default pool;
