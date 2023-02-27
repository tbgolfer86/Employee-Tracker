INSERT INTO department (name)
VALUES ("Accounting"),
       ("Human Resources"),
       ("IT"),
       ("Technology"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1),
       ("Associate", 55000, 5),
       ("Engineer", 110000, 4),
       ("Intern", 32000, 2),
       ("Executive", 222000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 1),
       ("Mike", "Jones", 1, 2),
       ("John", "Lennon", 1, 3),
       ("Happy", "Gilmore", 1, 4);

