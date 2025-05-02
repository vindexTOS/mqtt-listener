import { createConnection } from "mysql2/promise";

async function ensureDatabase() {
    const connection = await createConnection({
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
  
    const databaseName = 'mqtt-listener';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.end();
  }
  export default ensureDatabase