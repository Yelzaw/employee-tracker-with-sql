const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'kawthaung',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// Read all employees
app.get('/api/employees', (req, res) => {
  const sql = `
  SELECT e.id, e.first_name, e.last_name, title, name, salary, CONCAT(m.first_name,' ',m.last_name) as manager
  FROM employee as e 
  LEFT JOIN role as r
  ON e.role_id = r.id
  LEFT JOIN department as d 
  ON r.department_id = d.id
  LEFT JOIN employee as m 
  ON m.id = e.manager_id;
  `;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Read all departments
app.get('/api/departments', (req, res) => {
  const sql = `
  SELECT id, name FROM department;
  `;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Read all roles
app.get('/api/roles', (req, res) => {
  const sql = `
  SELECT role.id, role.title, department.name as department, role.salary
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id;
  `;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Create a department
app.post('/api/new-dept', ({ body }, res) => {
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  const params = [body.name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Create a role
app.post('/api/new-role', ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Create an employee
app.post('/api/new-employee', ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update an employee
app.post('/api/update-employee', ({ body }, res) => {
  const sql = `
  UPDATE employee SET role_id = ? WHERE id = ?;
  `;
  const params = [body.role_id, body.id];  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
