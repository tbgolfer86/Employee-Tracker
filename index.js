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

console.log('');
console.log(' ________________________________________________ ');
console.log('|                                                |');
console.log('|                                                |');
console.log('|                                                |');
console.log('|   |||||||||||| EMPLOYEE TRACKER ||||||||||||   |');
console.log('|                                                |');
console.log('|                                                |');
console.log('|                                                |');
console.log('|________________________________________________|');
console.log('');

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
            console.log('');
            console.log("Viewing all departments:");
            console.log('');
            console.table(results);
            init();
          });
        };
        if (data.Task == "View all roles") {
          db.query('SELECT role.id, role.title, role.salary, role.department_id, department.name FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.id ASC;', function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log('');
            console.log("Viewing all roles:");
            console.log('');
            console.table(results);
            init();
          });
        };
        if (data.Task == "View all employees") {
          db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.department_id, department.name, role.salary, employee.manager_id, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id', function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log('');
            console.log("Viewing all employees:");
            console.log('');
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
        console.log('');
        console.log('Successfully added department to the database.');
        console.log('');
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
          console.log('');
          console.log('Successfully added role to the database.');
          console.log('');
        init();
      });
    });
  });
};

function addEmployee () {
  db.query('SELECT * FROM role', function (err, results) {
    let roles = results.map((role) => ({
      name: role.title,
      value: role.id
    }))
    db.query('SELECT * FROM employee', function (err, results) {
      let managers = results.map((employee) => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id
      }))
      inquirer
        .prompt([
        {
          type: 'input',
          name: 'FirstName',
          message: 'Enter first name:',
        },
        {
          type: 'input',
          name: 'LastName',
          message: 'Enter last name:',
        },
        {
          type: 'list',
          name: 'Role',
          choices: roles,
          message: 'Select the employees role:',
        },
        {
          type: 'list',
          name: 'Manager',
          choices: managers,
          message: 'Select the employees manager:',
        },
        ])
        .then((data) => {
        db.query('INSERT INTO employee SET ?',{ 
          First_Name: data.FirstName,
          Last_Name: data.LastName,
          Role_id: data.Role,
          Manager_id: data.Manager,
        }, function (err, results) {
          if (err) {
          console.log(err);
          }
          console.log('');
          console.log('Successfully added employee to the database.');
          console.log('');
        init();
      });
      });
    });
  });
};

function updateRole () {
  db.query('SELECT * FROM employee', function (err, results) {
    let employees = results.map((employee) => ({
      name: employee.first_name + ' ' + employee.last_name,
      value: employee.id
    }))
    db.query('SELECT * FROM role', function (err, results) {
      let roles = results.map((role) => ({
        name: role.title,
        value: role.id
      }))
      inquirer
        .prompt([
        {
          type: 'list',
          name: 'Employee',
          choices: employees,
          message: 'Select an employee to update:',
        },
        {
          type: 'list',
          name: 'Role',
          choices: roles,
          message: 'Select the new role:',
        },
        ])
        .then((data) => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?',[
          data.Role,
          data.Employee,
        ], function (err, results) {
          if (err) {
          console.log(err);
          }
          console.log('');
          console.log('Successfully updated role.');
          console.log('');
        init();
      });
      });
    });
  });
};

init();

