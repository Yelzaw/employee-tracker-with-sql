const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

const Queries = require('./queries');
const queries = new Queries();

const actions = queries.actionsToSelect;

const mysql = require('mysql2');

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

const newRole = [
    {
        type:'input',
        name:'title',
        message:'What is the name of the role?'
    },
    {
        type:'input',
        name:'salary',
        message:'What is the salary of the role?'
    }
];

class Employees {
      
init (){  
    inquirer.prompt(questions).then((ansMain)=>{
        
        let index = actions.indexOf(ansMain.select);
        
        switch(index){
            case 0:
                return callEmployees();
            case 1:
                return insertNewEmp();
            case 2:
                return updateEmp();
            case 3:
                return callRoles();
            case 4:
                return this.insertNewRole();
            case 5:
                return callDepts();
            case 6:
                return insertNewDept();   
            case 7:             
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
    var newStaff=[];
    inquirer.prompt(newEmp).then((res)=> newStaff = res );
    db.query('SELECT id, title FROM role;', function(err, res){
    var roleS = res;
    if(err){console.log(err)
    } else{
        console.log(roleS);
    }
    })
    inquirer
    .prompt([

    ])
    .then((ans)=>{

    })
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
            console.log(answers);            
})()
    // ,function(err, result){
    //     if (err) console.log(err);

    //     const listDept = result.map(i=>i.name);

    //     inquirer.prompt(newRole).then((answer1)=>{
    //         answers = answer1;
    //         console.log(answer1);
    //     });
        
    // })
    // this.init();
    this.init();
}
}
module.exports = Employees;