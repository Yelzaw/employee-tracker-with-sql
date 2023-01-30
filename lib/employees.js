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

const newRole = [
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
        choices: db.query(queries.allDepts, function (err, results) {
            // return results;
            console.table(results);
        })
    }
]

// const updateData = (data, path) => {
//     fs.readFile(path, 'utf-8', (err,existingData)=>{
//         if(err){
//             console.error(err);
//         } else {
//             const changedjson = JSON.parse(existingData);
//             changedjson.push(data);
//             results.writeData(path, changedjson);
//         }
//     })
// }

class Employees extends Results{
  
 init (){
    inquirer.prompt(questions).then((answers)=>{
        const action = (Object.values(answers));
     
        if (action[0]===actions[0]){
            db.query(queries.allEmployees, function (err, result) {
                console.log("\n");
                console.table(result);
            })          
        } else if (action[0]===actions[3]){
            results.viewAllRoles();
        } else if (action[0]===actions[4]){
            return inquirer.prompt(newRole).then((answers)=>{
            const action = (Object.values(answers));
            results.addRole(queries.addRole,action);
            });
        } else if (action[0]===actions[5]){
            results.viewAllDepts();
        } else if (action[0]===actions[6]){
            return inquirer.prompt(newDept).then((answers)=>{                
                db.query(queries.addDept, answers, function (err, result) {
                    console.log("Added "+answers+" to the dabase.");            
                    results.updateData(result,'./lib/alldepts.json');            
                })                
            });
        } else {
            this.init();
        }
        this.init();
        })  
    };  
}


module.exports = Employees;