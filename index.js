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
        "Exit",
    ]
}];

function init() {
    inquirer
      .prompt(questions)
      .then((data) => {
        console.log(data.Task);
        if (data.Task == "View all departments") {
          db.query('SELECT * FROM department', function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log("Viewing all departments:");
            console.table(results);
            init();
          });
        };
        if (data.Task == "View all roles") {
          db.query('SELECT * FROM role', function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log("Viewing all roles:");
            console.table(results);
            init();
          });
        };
        if (data.Task == "View all employees") {
          db.query('SELECT * FROM employee', function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log("Viewing all employees:");
            console.table(results);
            init();
          });
        };
        if (data.Task == "Add a department") {
            addDepartment();
        };
        if (data.Task == "Add a role") {
            addRole();
        };
        if (data.Task == "Add an employee") {
            addEmployee();
        };
        if (data.Task == "Update an employee role") {
            updateRole();
        };
        if (data.Task == "Exit") {
          process.exit();
        };
      });
};

function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'Department',
          message: 'Enter the name of the department:',
        }
      ])
      .then((data) => {
        db.query('INSERT INTO department SET ?',{ 
          Name: data.Department 
        }, function (err, results) {
          if (err) {
          console.log(err);
          }
        console.log("You added: " + data.Department + " to the database.");
        init();
      });
    });
};

function addRole () {
  db.query('SELECT * FROM department', function (err, results) {
    let depts = results.map((dept) => ({
      name: dept.name,
      value: dept.id
    }))
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'Title',
          message: 'Enter the name of role:',
        },
        {
          type: 'input',
          name: 'Salary',
          message: 'Enter the salary of role:',
        },
        {
          type: 'list',
          name: 'Department',
          choices: depts,
          message: 'Select the department for the role:'
        }
      ])
      .then((data) => {
        db.query('INSERT INTO role SET ?',{ 
          Title: data.Title,
          Salary: data.Salary,
          Department_id: data.Department
        }, function (err, results) {
          if (err) {
          console.log(err);
          }
          console.log("You added: " + data.Title, data.Salary, data.Department + " to the database.");
        init();
      });
    });
  });
};

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

init();

