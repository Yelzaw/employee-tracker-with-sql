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


function spacerTitle(int) {
    var space = "";
   for (var i = 0; i < int; i++){
      space += " ";
   }
   return space;
  }

class Results {

    viewAllEmpolyees(choices){
        db.query(choices, function (err, results) {
            const res = Object.keys(results[0]);              
            var title="";
            for (const key of res){
                if(key === 'id'){
                    title += key+spacerTitle(3);
                    } else if (key === 'title') {
                    title += key+spacerTitle(20-key.length);
                    } else {
                    title += key+spacerTitle(15-key.length);
                    }
                }
            console.log("\n",title)
            results.forEach(i=> {
              console.log(" ",i.id, spacerTitle(3),i.first_name, spacerTitle(12-i.first_name.length), i.last_name, spacerTitle(12-i.last_name.length), i.title,spacerTitle(20-i.title.length), i.department, spacerTitle(12-i.department.length), i.salary,spacerTitle(11-i.salary.length), i.manager)
            });    
        })
    }

    viewAllDepts(choices){
        db.query(choices, function (err, results) {
            const res = Object.keys(results[0]);              
            var title="";
            for (const key of res){
                if(key === 'id'){
                    title += key+spacerTitle(5);
                    } else {
                    title += key+spacerTitle(15-key.length);
                    }
                }
            console.log("\n",title)
            results.forEach(i=> {
              console.log(" ",i.id, spacerTitle(3),i.name)
            });    
        })
    }

    viewAllRoles(choices){
        db.query(choices, function (err, results) {
            const res = Object.keys(results[0]);              
            var title="";
            for (const key of res){
                if(key === 'id'){
                    title += key+spacerTitle(5);
                    } else if (key === 'title') {
                    title += key+spacerTitle(20-key.length);
                    } else {
                    title += key+spacerTitle(15-key.length);
                    }
                }
            console.log("\n",title)
            results.forEach(i=> {
              console.log(" ",i.id, spacerTitle(3),i.title, spacerTitle(20-i.title.length), i.department, spacerTitle(12-i.department.length), i.salary)
            });    
        })
    }

    addDept(sql,name){
        db.query(sql, name, function (err, results) {
            db.query(`SELECT id, name FROM department;`, function (err, results) {
                const res = Object.keys(results[0]);              
                var title="";
                for (const key of res){
                    if(key === 'id'){
                        title += key+spacerTitle(5);
                        } else {
                        title += key+spacerTitle(15-key.length);
                        }
                    }
                console.log("\n",title)
                results.forEach(i=> {
                  console.log(" ",i.id, spacerTitle(3),i.name)
                });    
            })
        })
    }
}

module.exports = Results;