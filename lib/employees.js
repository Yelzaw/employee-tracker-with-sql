const {input} = require('enquirer');
const {viewAllEmployees} = require('./queries');
// var sqlresults = require('./queries')
var actionsToSelect = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'];

class Employees {
    
 init (){
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            choices: actionsToSelect
        }
    .then((answers)=>{
        if(answers === actionsToSelect[0]){
            db.query(viewAllEmployees, function (err, results) {
                const res = Object.keys(results[0]);
                
                var title="";
                for (const key of res){
                 title += key+spacerTitle(8);
                }
                console.log(title)
                results.forEach(i=> {
                      console.log(i.id, spacerTitle(8),i.first_name, spacerTitle(15-i.first_name.length), i.last_name)
                });    
                console.log(results[0.0]);
              });
        }
    })
    ])
}

spacerTitle(int) {
    var space = "";
   for (var i = 0; i < int; i++){
      space += " ";
   }
   return space;
  }
}

module.exports = Employees;