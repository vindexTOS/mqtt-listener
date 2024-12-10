import { createConnection } from "mysql2/promise";

async function ensureDatabase() {
    const connection = await createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '258741',
    });
  
    const databaseName = 'mqtt-listener';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.end();
  }
  export default ensureDatabase