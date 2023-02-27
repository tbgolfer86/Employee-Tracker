const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

const questions = [{
    type: 'list',
    name: 'Task',
    message: 'What would you like to do?',
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Nothing",
    ]
}];

function init() {
    inquirer
      .prompt(questions)
      .then((data) => {
        if (data == "View all departments") {
          db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
          });
        }  
    });
}

init();

