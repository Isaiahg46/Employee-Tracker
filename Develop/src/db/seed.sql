INSERT INTO department (department_name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO roles (title, salary, department)
VALUES ('Software Engineer', 100000, 1),
       ('Accountant', 80000, 2),
       ('Lawyer', 120000, 3),
       ('Sales Lead', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 1, 1),
       ('Ashley', 'Rodriguez', 2, 1),
       ('Kevin', 'Tupik', 2, 2),
       ('Kunal', 'Singh', 3, 1),
       ('Malia', 'Brown', 3, 3),
       ('Sarah', 'Lourd', 4, 1),
       ('Tom', 'Allen', 4, 7);