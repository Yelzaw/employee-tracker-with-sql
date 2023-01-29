const viewAllEmployees = `
SELECT e.id, e.first_name, e.last_name, title, name, salary, CONCAT(m.first_name,' ',m.last_name) as manager
FROM employee as e 
LEFT JOIN role as r
ON e.role_id = r.id
LEFT JOIN department as d 
ON r.department_id = d.id
LEFT JOIN employee as m 
ON m.id = e.manager_id;`;

module.exports = {viewAllEmployees};