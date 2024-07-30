const sql = require('mssql');

// Configuration object for the database connection
const config = {
  user: 'propyfinder123',
  password: 'Propy@123',
  server: 'propyfinderserver.database.windows.net', // You can use 'localhost' if SQL Server is running locally
  database: 'propyfinderDB',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    enableArithAbort: true // Use this if you're using newer versions of SQL Server
  }
};

// Function to establish a connection
async function connectToDatabase() {
    try {
      // Create a new connection pool
      const pool = await sql.connect(config);
      return pool;
    } catch (err) {
      // Handle errors
      console.error('Error connecting to database:', err);
      throw err;
    }
  }
  
  module.exports = { connectToDatabase };