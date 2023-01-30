const inquirer = require('inquirer');

const Results = require('./results');
const results = new Results();
const Queries = require('./queries');
const queries = new Queries();

const actions = queries.actionsToSelect;

const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'kawthaung',
      database: 'employees_db'
    },
  );

const questions = [
    {
        type: 'list',
        name: 'What would you like to do?',
        choices: actions,
    }
];

const newDept = [
    {
        type: 'input',
        name: 'name',
        message: `What is new Department's name?`
    }
]


class Employees extends Results{
      
 init (){  
    inquirer.prompt(questions).then((answers)=>{
        const action = (Object.values(answers));
     
        if (action[0]===actions[0]){
            db.query(queries.allEmployees, function (err, result) {
                if(err){console.log(err)}
                else{
                    console.log('\n');
                    console.table(result);
                };                
            });
            this.init();
        } else if (action[0]===actions[3]){
            results.viewAllRoles();

        } else if (action[0]===actions[4]){
            db.query(queries.nameOfRoles,function(err, result){
                if(err)console.log(err);
                const listRoll = result.map(i=>i.title);
                
                inquirer
                .prompt(
                    {
                        type: 'input',
                        name: 'title',
                        message: `What is the name of the role?`
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: `What is the salary of the role?`
                    },
                    {
                        type: 'list',
                        name: 'Which department does the role belong to?',
                        choices: listRoll
                    },
                )
                .then((answers)=>{
                    console.log(answers);
                    console.log(listRoll);
                    const rightIndex = 1+listRoll.findIndex(i=>i===answers[2]);
                    console.log(rightIndex);
                    // db.query(queries.newRole,answers,function(err, result){
                    //     if(err)console.log(err);
                    //     console.log(result);
                    // })
                })
            })

        } else if (action[0]===actions[5]){            
                db.query(queries.allDepts, function (err, result) {
                    if (err) console.log(err);
                    console.log("\n");
                    console.table(result);                    
                });
                db.query('SELECT name FROM department;',function(err, result){
                    
                })

        } else if (action[0]===actions[6]){
            return inquirer.prompt(newDept).then((answers)=>{                
                db.query(queries.addDept, answers, function (err, result) {
                    console.log("Added "+answers+" to the dabase.");              
                })                
            });

        } else {
            this.init();
        }
        })          
    };    
}


module.exports = Employees;