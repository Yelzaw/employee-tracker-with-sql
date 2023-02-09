const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

const Queries = require('./queries');
const queries = new Queries();

const actions = queries.actionsToSelect;

const mysql = require('mysql2');
const { exit } = require('process');

const db = mysql.createPool({
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'kawthaung',
      database: 'employees_db'
    },
  );

const query =util.promisify(db.query).bind(db);

// Calling maing menu
const questions = [
    {
        type: 'list',
        name: 'select',
        message: 'What would you like to do?',
        choices: actions,
    }
];

const newDept = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of new department?'
    }
];


class Employees {
      
init (){  
    //Prompt Main Menu to user
    inquirer.prompt(questions).then((ansMain)=>{
        
        let index = actions.indexOf(ansMain.select);
    //Based on user's choice, will call next function with switch
        switch(index){
            case 0:
                return this.callEmployees();
            case 1:
                return this.insertNewEmp();
            case 2:
                return this.updateEmp();
            case 3:
                return this.callRoles();
            case 4:
                return this.insertNewRole();
            case 5:
                return this.callDepts();
            case 6:
                return this.insertNewDept();   
            case 7: 
                return this.callAllManagers();
            case 8:
                return this.callEmpsByDept();
            case 9:
                return this.callTotalBudgetDepts();
            case 10:
                exit(0);
        };
    });
}

// Query the list of all employees
callEmployees(){
    db.query(queries.allEmployees, function (err, results) {
        if(err)console.log(err);        
            console.log('\n');
            console.table(results,'\n\n\n\n\n\n\n');
            console.info('Please press arrow key to show menu.');
            // console.log('Please press arrow key to show menu.');            
        });   
    this.init();  
}

// Query the list of all roles
callRoles(){    
    db.query(queries.allRoles, function (err, results) {
        console.log("\n");
        console.table(results,'\n\n\n\n\n\n\n');
        console.log('Please press arrow key to show menu.');
    })
    this.init();
}

// Query the list of all departments
callDepts(){
    db.query(`SELECT id, name FROM department;`, function (err, results) {
        if (err) console.log(err);
        console.log("\n");
        console.table(results,'\n\n\n\n\n\n\n');
        console.log('Please press arrow key to show menu.');        
    });    
    this.init();
}

// Query the list of all managers 
callAllManagers(){
    db.query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id IS NULL;`, function (err, results) {
        if (err) console.log(err);
        console.log("\n");
        console.table(results,'\n\n\n\n\n\n\n');
        console.log('Please press arrow key to show menu.');        
    });    
    this.init();
}

// Query the list of employees by Department
callEmpsByDept(){
    (async()=>{
        var listDepts = await query(`SELECT id, name FROM department;`);        
        listDepts.push({id:6, name: 'All Departments'});//<----
        // console.log(listDepts);
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select the department, to view employees by department.',
                choices: listDepts
            }
        ])
        .then((answer)=>{
            console.log(answer);
            const deptID = listDepts.find(i=>i.name === answer.name);
            console.log(deptID.id);
            if (deptID.id<6){

                db.query(`SELECT e.id, CONCAT(e.first_name,' ',e.last_name) as Name, title as Role, name as Department, salary
                FROM employee as e 
                LEFT JOIN role as r
                ON e.role_id = r.id
                LEFT JOIN department as d 
                ON r.department_id = d.id
                WHERE department_id = ${deptID.id};`, function (err, results) {
                    if (err) console.log(err);
                    console.log("\n");
                    console.table(results,'\n\n\n\n\n\n\n');
                    console.log('Please press arrow key to show menu.');        
                });
            } else {
                db.query(`SELECT d.name as Department, CONCAT(e.first_name,' ',e.last_name) as Name, title as Role
                FROM employee as e 
                LEFT JOIN role as r
                ON e.role_id = r.id
                LEFT JOIN department as d 
                ON r.department_id = d.id;`, function (err, results) {
                    if (err) console.log(err);
                    console.log("\n");
                    console.table(results,'\n\n\n\n\n\n\n');
                    console.log('Please press arrow key to show menu.');        
                });
            }
        })
        .then(()=>this.init());
    })()
}

// Query total budget by departments
callTotalBudgetDepts(){
    db.query(`SELECT d.id, name as Department, SUM(salary)
    FROM employee as e 
    LEFT JOIN role as r
    ON e.role_id = r.id
    LEFT JOIN department as d 
    ON r.department_id = d.id
    GROUP BY d.id;`, function (err, results) {
        if (err) console.log(err);
        console.log("\n");
        console.table(results,'\n\n\n\n\n\n\n');
        console.log('Please press arrow key to show menu.');        
    });    
    this.init();
}

// Create a new department
insertNewDept(){
    return inquirer.prompt(newDept).then((answers)=>{   
        console.log(answers.name);           
        db.query(`INSERT INTO department (name)
        VALUES (?);`, answers.name, function (err, results) {
            console.log("Added "+ answers.name +" to the dabase.");               
        });
        this.init();
    });    
}

// Create a new employee 
insertNewEmp(){
    (async()=>{        
        const managers = await query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id IS NULL;`);
        const listManager = managers.map(j=>j.name);

        const roles = await query(`SELECT id, title FROM role;`);
        const listRole = roles.map(i=>i.title);
        
        // console.log(listRole);
        // console.log(managers);
        // console.log(listManager);
        return inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Please fill the first name of new employee?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please fill the last name of new employee?'
            },            
            {
                name: 'role_id',
                type: 'list',                        
                message:'Please select a role of new employee?',
                choices: listRole
            },
            {   
                type: 'confirm',
                name: 'manager',
                message: 'Do you want to appoint manager for new employee?', 
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Please select the name of manager.',
                choices: listManager,
                when(answers) {
                  return answers.manager;
                },
            }
        ])
        .then((answer1)=>{
            const assignRole = roles.find(i=>i.title === answer1.role_id); 
            const assignManager = managers.find(i=>i.name === answer1.manager_id);
            // console.log(answer1);
            // console.log(answer1.manager);
            // console.log(assignRole);
            // console.log(assignManager);
            if(answer1.manager){
                // console.log(answer1.first_name,answer1.last_name);
                db.query(`INSERT INTO employee( first_name, last_name, role_id, manager_id)
                VALUES  ("${answer1.first_name}","${answer1.last_name}", ${assignRole.id}, ${assignManager.id});`, function (err, results) {
                    console.log("New employee has added to the dabase.");       
                });  
                     
            } else {                
                db.query(`INSERT INTO employee( first_name, last_name, role_id)
                VALUES  ("${answer1.first_name}","${answer1.last_name}", ${assignRole});`, function (err, results) {
                    console.log("New employee has added to the dabase.");
                });
                
            }            
        })
        .then(()=>this.init());
    })()    
}

// Update and change existing employee information
updateEmp(){
    (async()=>{
        const employees = await query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee;`);
        const listEmps = employees.map(i=>i.name);

        const roles = await query(`SELECT id, title FROM role;`);
        const listRole = roles.map(i=>i.title);

        const managers = await query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id IS NULL;`);
        const listManager = managers.map(j=>j.name);

        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select the name employee that you wish to update.',
                choices: listEmps
            },
            {
                name: 'role_id',
                type: 'list',                        
                message:'Please select a role of new employee?',
                choices: listRole
            },
            {   
                type: 'confirm',
                name: 'manager',
                message: 'Do you want to appoint manager for new employee?', 
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Please select the name of manager.',
                choices: listManager,
                when(answers) {
                  return answers.manager;
                },
            }
        ])
        .then((answer)=>{
            // console.log(answer);
            const empID = employees.find(i=>i.name === answer.name);
            const assignRoleID = roles.find(i=>i.title === answer.role_id); 
            const assignManagerID = managers.find(i=>i.name === answer.manager_id);
            // console.log(empID,assignManagerID,assignRoleID);
            if(answer.manager){           
                console.log(assignRoleID,assignManagerID,empID);     
                db.query(`UPDATE employee SET role_id = ${assignRoleID.id}, manager_id = ${assignManagerID.id} WHERE id = ${empID.id};`, function (err, results) {
                    console.log(`Updated info of ${answer.name}.`);       
                });                       
            } else {              
                // console.log(assignRoleID,assignManagerID,empID);    
                db.query(`UPDATE employee SET role_id = ${assignRoleID.id}, manager_id = NULL WHERE id = ${empID.id};`, function (err, results) {
                    console.log(`Updated info of ${answer.name}.`);       
                });                 
            }
        })
        .then(()=>this.init());
    })()
}
 
// Create a new role
insertNewRole(){
    (async()=>{
        const answers = await query(`SELECT id, name FROM department;`);
        const listDept = answers.map(i=>i.name);
        // console.log(listDept);
        return inquirer
        .prompt([
            {
                type:'input',
                name:'title',
                message:'What is the name of the role?'
            },
            {
                type:'number',
                name:'salary',
                message:'Please fill the salary for this role?',
                validate: (answer) => {
                    if (isNaN(answer)){
                        return 'Please enter valid number';
                    }
                    return true;
                },
            },
            {
                name: 'dept_id',
                type: 'list',                        
                message:'Which department does the role belong to?',
                choices: listDept
            }
        ])
        .then((answer)=>{
            const rightDept = answers.find(i=>i.name === answer.dept_id);
            // console.log(answer);
            // console.log(rightDept);
            console.log("Added "+ answer.title +" to the dabase.");
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}",${answer.salary},${rightDept.id});`, function (err, results) {
            
            })
            
        }) 
        .then(()=>this.init());
    })()    
}
}

module.exports = Employees;