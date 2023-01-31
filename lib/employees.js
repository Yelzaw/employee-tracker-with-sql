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

const newEmp = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is first name of new employee?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is last name of new employee?'
    }
];

class Employees {
      
init (){  
    inquirer.prompt(questions).then((ansMain)=>{
        
        let index = actions.indexOf(ansMain.select);
        
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
                exit(0);
        };
    });
}

callEmployees(){
    db.query(queries.allEmployees, function (err, results) {
        if(err)console.log(err);        
            console.log('\n');
            console.table(results)            
            console.log('Please press arrow key to show menu.');            
        });   
    this.init();  
}

callRoles(){    
    db.query(queries.allRoles, function (err, results) {
        console.log("\n");
        console.table(results);
        console.log('Please press arrow key to show menu.');
    })
    this.init();
}

callDepts(){
    db.query(`SELECT id, name FROM department;`, function (err, results) {
        if (err) console.log(err);
        console.log("\n");
        console.table(results);
        console.log('Please press arrow key to show menu.');        
    });    
    this.init();
}

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
  
insertNewEmp(){
    (async()=>{
        const answers = await query(`SELECT id, title FROM role;`);
        const managers = await query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id IS NULL;`);
        const listRole = answers.map(i=>i.title);
        const listManager = managers.map(j=>j.name);
        console.log(listRole);
        console.log(managers);
        console.log(listManager);
        return inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is first name of new employee?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is last name of new employee?'
            },
            {
                name: 'role_id',
                type: 'list',                        
                message:'What is the role of new employee?',
                choices: listRole
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Who is manager for new employee?',
                choices:  listManager
            }
        ])
    })()

    // var newStaff=[];
    // inquirer.prompt(newEmp).then((res)=> newStaff = res );
    // db.query('SELECT id, title FROM role;', function(err, res){
    // var roleS = res;
    // if(err){console.log(err)
    // } else{
    //     console.log(roleS);
    // }
    // })
    // inquirer
    // .prompt([

    // ])
    // .then((ans)=>{

    // })
}

updateEmp(){
    db.query(`SELECT id, CONCAT(first_name,' ',last_name) as name FROM employee;`, function (err, res1) {
        if (err) console.log(err);
        var listEmps = res1.map(i=>i.name);

        db.query(`SELECT id, title FROM role;`, function (err, res2) {
            if (err) console.log(err);
            var listRole = res2.map(i=>i.title);

            inquirer
            .prompt([
                {
                    type:'list',
                    name: 'name',
                    message: 'Please select employee name who you wish to update',
                    choices: listEmps
                }
                // ,
                // {
                //     type:'list',
                //     name: 'role_id', 
                //     message:'Please select the new role',
                //     choices: listRole
                // }
            ])
            .then((ans)=>{
                console.log
                var rightName = ans.find(i=>i.name === listEmps.name);
                console.log(rightName);
                var rightRole = ans.find(i=>i.role_id === listRole.name);
            })
        })
    })
    this.init();
}
 
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
                type:'input',
                name:'salary',
                message:'What is the salary of the role?'
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