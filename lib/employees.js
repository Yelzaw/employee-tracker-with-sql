const inquirer = require('inquirer');
const {allEmployees,actionsToSelect,allDepts} = require('./queries');
const Results = require('./results');
const results = new Results();


const questions = [
    {
        type: 'list',
        name: 'What would you like to do?',
        choices: actionsToSelect,
    }
];

class Employees extends Results{
  
 init (){
    return inquirer.prompt(questions).then((answers)=>{
        const action = (Object.values(answers));
        console.log(action[0]);
        console.log(actionsToSelect[0]);
        if (action[0]===actionsToSelect[0]){
            results.viewAllEmpolyees(allEmployees);
        } else if (action[0]===actionsToSelect[5]){
            results.viewAllDepts(allDepts);
        } else {
            return this.init();
        }
        return this.init();
        })  
    };  
}


module.exports = Employees;