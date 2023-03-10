require('events').EventEmitter.defaultMaxListeners = 0;
const express = require('express');
const Employees = require('./lib/employees')
const employees = new Employees();
// Import and require mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     // MySQL username,
//     user: 'root',
//     // TODO: Add MySQL password here
//     password: 'kawthaung',
//     database: 'employees_db'
//   },
//   console.log(`Connected to the employees_db database.`)
// );

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

employees.init();