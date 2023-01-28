const inquirer = require("inquirer");
const fs = require('fs');
var teamMember = "";

class Employee {
    // Start with questions for manager profile 
    creatTeam(){
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is team manager name?'
            },
            {
                type: 'input',
                name: 'id',
                message: 'What is team manager ID number?'
            },
            {
                type: 'input',
                name: 'email',
                message: 'What is team manager email address?'
            },
            {
                type: 'input',
                name: 'office',
                message: 'What is team manager office number?'
            }
        ])
        .then ((answers)=>{
            // Generate Manager profile
            const manager = new Manager();
           teamMember += manager.generateManager(answers);
        })    
        .then (() => {
            // Prompt the question for any additional team member
        this.addictionMember();
        })
    }
    // Function to add another team memeber profile
    addictionMember(){
        //prompt the questions for Engineer, Intern or Completed
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'answer',
                    message:'Do you want to add another team member?',
                    choices: ['Engineer', 'Intern', 'Profile completed']
                }
            ])
            .then(val => {
                // based on the answer questions will continue
                if(val.answer === 'Engineer'){
                    inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'What is Engineer name?'
                        },
                        {
                            type: 'input',
                            name: 'id',
                            message: 'What is Engineer ID number?'
                        },
                        {
                            type: 'input',
                            name: 'email',
                            message: 'What is Engineer email address?'
                        },
                        {
                            type: 'input',
                            name: 'github',
                            message: 'What is Engineer github?'
                        }
                    ])
                    .then ((answers)=>{
                        //generate Engineer Profile
                        const engineer = new Engineer();
                        teamMember += engineer.generateEngineer(answers);//use Engineer class to generate code of HTML
                    })    
                    .then (() => {
                    this.addictionMember();
                    })                    
                } else if (val.answer === 'Intern'){
                    //if user choose Intern, will question prompt for intern
                    inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'What is Intern name?'
                        },
                        {
                            type: 'input',
                            name: 'id',
                            message: 'What is Intern ID number?'
                        },
                        {
                            type: 'input',
                            name: 'school',
                            message: 'What is Intern school name?'
                        }
                    ])
                    .then ((answers)=>{
                        //Generate intern profile
                        const intern = new Intern();
                        teamMember += intern.generateIntern(answers);//use Intern class to generate codes of HTML
                    })    
                    .then (() => {
                    this.addictionMember();
                    })         
                } else {
                    //if user choose completed, HTML file will be exported wit full code of HTML
                    fs.writeFile(`./dist/sample-index.html`, this.generateTeam(teamMember),(err) =>
                    err ? console.log(err) : console.log('Generated team profile ....'));
                    fs.writeFile(`./dist/style.css`, this.generateCSS(),(err) =>
                    err ? console.log(err) : console.log());
                    
                }

            })
    }

    generateCSS(){
        const styleCSS =
        `* {
        box-sizing: border-box;
      }   
      .team-member {
        background-color: bisque;
        color: blue;
      }
      .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48
      }
      `
      return styleCSS;
    }

    generateTeam(teamMember){
        const contentTeam = 
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style.css" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <title>Project Team Profile</title>
        </head>
        <body>
            
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 p-5 mb-3 bg-secondary">
                        <h1 class="text-center">Project Team Profile</h1>
                    </div>            
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12 d-flex justify-content-around">
        
                ${teamMember}
    
                    </div>
                </div>
            </div>
        </body>
        </html>
        `
        return contentTeam;
    }    
}

module.exports = Employee;