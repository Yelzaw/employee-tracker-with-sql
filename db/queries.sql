-- Query to view all employee
SELECT e.id, e.first_name, e.last_name, title, name, salary, CONCAT(m.first_name,' ',m.last_name) as manager
FROM employee as e 
LEFT JOIN role as r
ON e.role_id = r.id
LEFT JOIN department as d 
ON r.department_id = d.id
LEFT JOIN employee as m 
ON m.id = e.manager_id;

-- Query to view all departments
SELECT id, name FROM department;

-- Query to view all roles
SELECT role.id, role.title, department.name as department, role.salary
FROM role
LEFT JOIN department
ON role.department_id = department.id;

-- Query to add department
INSERT INTO department (name)
VALUES ("Service");

-- Query to add role
INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service", 80000, 5);

-- Query to add employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Kash", 9, 3)

-- Query to update Employee Role
UPDATE employee SET role_id = 1 WHERE id = 9;