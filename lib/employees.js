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
            db.query(queries.allRoles, function (err, results) {
                console.log("\n");
                console.table(results);
            })
            this.init();

        } else if (action[0]===actions[4]){
            db.query(`SELECT id, name FROM department;`,function(err, result){
                if(err)console.log(err);
                const listDept = result.map(i=>i.name);
                console.log(listDept);
                inquirer
                .prompt([
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
                        name: 'dept_id',
                        message:'Which department does the role belong to?',
                        choices: listDept
                    },
                ])
                .then((answers)=>{
                    console.log(answers);
                    console.log(listDept);
                    const rightDept = result.find(i=>i.name===answers.dept_id);
                    console.log(rightDept);
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}",${answers.salary},${rightDept.id});`, function (err, results) {
                        if(err){console.log(err)};
                        console.log("Added "+answers.title+" to the dabase.");  
                    })
                })
                this.init();
            })

        } else if (action[0]===actions[5]){            
                db.query(`SELECT id, name FROM department;`, function (err, result) {
                    if (err) console.log(err);
                    console.log("\n");
                    console.table(result);                    
                });
                this.init();
        } else if (action[0]===actions[6]){
            return inquirer.prompt(newDept).then((answers)=>{                
                db.query(queries.addDept, answers, function (err, result) {
                    console.log("Added "+answers+" to the dabase.");              
                });
                this.init();
            });

        } else {
            this.init();
        }
        })          
    };    
}


module.exports = Employees;