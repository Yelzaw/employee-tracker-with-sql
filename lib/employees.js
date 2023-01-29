const inquirer = require('inquirer');

const Results = require('./results');
const results = new Results();
const Queries = require('./queries');
const queries = new Queries();
const actions = queries.actionsToSelect;

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
    return inquirer.prompt(questions).then((answers)=>{
        const action = (Object.values(answers));
        console.log(action[0]);
        console.log(actions[0]);
        if (action[0]===actions[0]){
            results.viewAllEmpolyees(queries.allEmployees);
        } else if (action[0]===actions[3]){
            results.viewAllRoles(queries.allRoles);
        } else if (action[0]===actions[5]){
            results.viewAllDepts(queries.allDepts);
        } else if (action[0]===actions[5]){
            results.viewAllDepts();
        } else {
            return this.init();
        }
        return this.init();
        })  
    };  
}


module.exports = Employees;