
class Queries{
    
actionsToSelect = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'];

allEmployees = `
SELECT e.id, e.first_name, e.last_name, title, name as department, salary, CONCAT(m.first_name,' ',m.last_name) as manager
FROM employee as e 
LEFT JOIN role as r
ON e.role_id = r.id
LEFT JOIN department as d 
ON r.department_id = d.id
LEFT JOIN employee as m 
ON m.id = e.manager_id;`;

allDepts = `SELECT id, name FROM department;`;

allRoles =`SELECT role.id, role.title, department.name as department, role.salary
FROM role
LEFT JOIN department
ON role.department_id = department.id;`;

nameOfRoles = `SELECT role.title FROM role`;

addDept =`INSERT INTO department (name)
VALUES (?);`;

newRole =`INSERT INTO role (title, salary, department_id)
VALUES`;
}

module.exports = Queries;