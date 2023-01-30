const cTable = require('console.table');
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
    console.log(`Connected to the employees_db database.`)
  );

const Queries = require('./queries');
const queries = new Queries();

class Results extends Queries{          
    
    viewAllRoles(){
        db.query(queries.allRoles, function (err, results) {
            console.log("\n");
            console.table(results);
        })
    }

    addDept(sql,name){
        db.query(sql, name, function (err, results) {
            console.log("Added "+name+" to the dabase.");            
            results.updateData(result,'./lib/alldepts.json');            
        })
    }

    addRole(sql,name){
        db.query(sql, name, function (err, results) {
            console.log("Added "+name+" to the dabase.")            
        })
    }    

    
}

module.exports = Results;