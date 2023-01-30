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

const fs = require('fs');
const util = require('util');

class Results extends Queries{     

    viewAllDepts(){
        db.query(queries.allDepts, function (err, results) {
            if (err) console.log(err);
            console.log("\n");
            console.table(results);
        })

    }

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


    readData = util.promisify(fs.readFile);    

    writeData = (filepath, data) =>
    fs.writeFile(filepath, JSON.stringify(data, null, 4), (err)=>
    err ? console.error(err) : console.info());

    updateData = (data, path) => {
            fs.readFile(path, 'utf-8', (err,existingData)=>{
                if(err){
                    console.error(err);
                } else {
                    const changedjson = JSON.parse(existingData);                   
                    changedjson.push(data);
                    this.writeData(path, changedjson);
                }
            })
        }

}

module.exports = Results;