import inquirer from 'inquirer';
import express from 'express';
import { pool, connectToDb } from './connection.js';
await connectToDb();
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
class Cli {
    addDepartment() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter department name:',
            }
        ])
            .then((answers) => {
            const departmentName = answers.name;
            // Check if the department already exists
            pool.query(`SELECT * FROM department WHERE department_name = $1`, [departmentName], (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                    return;
                }
                if (results.rows.length > 0) {
                    console.log('Department already exists. Please enter a different name.');
                    this.startCli(); // Restart the CLI or prompt again
                }
                else {
                    // If it doesn't exist, insert the new department
                    pool.query(`INSERT INTO department (department_name) VALUES ($1)`, [departmentName], (insertError) => {
                        if (insertError) {
                            console.error('Error executing query', insertError.stack);
                        }
                        else {
                            console.log('Department added successfully!');
                            this.startCli(); // Restart the CLI after successful insertion
                        }
                    });
                }
            });
        });
    }
    viewAllDepartments() {
        pool.query('SELECT * FROM department', (error, result) => {
            if (error) {
                console.error('Error executing query', error.stack);
            }
            else {
                console.table(result.rows);
                this.startCli();
            }
        });
    }
    addRole() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Enter role ID:',
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter role salary:',
            },
            {
                type: 'input',
                name: 'departmentID',
                message: 'Enter department ID:',
            },
        ])
            .then((answers) => {
            const { id, title, salary, departmentID } = answers;
            // Check if the role ID already exists
            pool.query(`SELECT * FROM roles WHERE id = $1`, [id], (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                    return;
                }
                if (results.rows.length > 0) {
                    console.log('Role ID already exists. Please enter a different ID.');
                    this.startCli(); // Restart the CLI or prompt again
                }
                else {
                    // Optionally, check if the department ID exists
                    pool.query(`SELECT * FROM department WHERE id = $1`, [departmentID], (deptError, deptResults) => {
                        if (deptError) {
                            console.error('Error executing query', deptError.stack);
                            return;
                        }
                        if (deptResults.rows.length === 0) {
                            console.log('Department ID does not exist. Please enter a valid department ID.');
                            this.startCli(); // Restart the CLI or prompt again
                        }
                        else {
                            // If both checks pass, insert the new role
                            pool.query('INSERT INTO roles (id, title, salary, department) VALUES ($1, $2, $3, $4)', [id, title, salary, departmentID], (insertError) => {
                                if (insertError) {
                                    console.error('Error executing query', insertError.stack);
                                }
                                else {
                                    console.log('Role added successfully');
                                    this.startCli(); // Restart the CLI after successful insertion
                                }
                            });
                        }
                    });
                }
            });
        });
    }
    viewAllRoles() {
        pool.query('SELECT * FROM roles', (error, result) => {
            if (error) {
                console.error('Error executing query', error.stack);
            }
            else {
                console.table(result.rows);
                this.startCli();
            }
        });
    }
    addEmployee() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter employee first name:',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter employee last name:',
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter employee role ID:',
            },
            {
                type: 'input',
                name: 'managerFirstName',
                message: 'Enter employee manager first name (or leave blank if none):',
            },
            {
                type: 'input',
                name: 'managerLastName',
                message: 'Enter employee manager last name (or leave blank if none):',
            },
        ])
            .then((answers) => {
            const { firstName, lastName, roleId, managerFirstName, managerLastName } = answers;
            // Check if the employee ID already exists
            pool.query(`SELECT * FROM employee WHERE role_id = $1 AND first_name = $2 AND last_name = $3`, [roleId, firstName, lastName], (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                    return;
                }
                if (results.rows.length > 0) {
                    console.log('An employee with this role ID, first name, and last name already exists. Please enter different details.');
                    this.startCli(); // Restart the CLI or prompt again
                }
                else {
                    // Optionally, check if the role ID exists
                    pool.query(`SELECT * FROM roles WHERE id = $1`, [roleId], (roleError, roleResults) => {
                        if (roleError) {
                            console.error('Error executing query', roleError.stack);
                            return;
                        }
                        if (roleResults.rows.length === 0) {
                            console.log('Role ID does not exist. Please enter a valid role ID.');
                            this.startCli(); // Restart the CLI or prompt again
                        }
                        else {
                            // Check if the manager's first and last name exist (if provided)
                            if (managerFirstName && managerLastName) {
                                pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`, [managerFirstName, managerLastName], (managerError, managerResults) => {
                                    if (managerError) {
                                        console.error('Error executing query', managerError.stack);
                                        return;
                                    }
                                    if (managerResults.rows.length === 0) {
                                        console.log('Manager does not exist. Please enter a valid manager name or leave it blank.');
                                        this.startCli(); // Restart the CLI or prompt again
                                    }
                                    else {
                                        const managerId = managerResults.rows[0].id; // Get the manager ID
                                        // If all checks pass, insert the new employee
                                        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId], (insertError) => {
                                            if (insertError) {
                                                console.error('Error executing query', insertError.stack);
                                            }
                                            else {
                                                console.log('Employee added successfully');
                                                this.startCli(); // Restart the CLI after successful insertion
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                // If no manager is provided, insert the new employee
                                pool.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [firstName, lastName, roleId], (insertError) => {
                                    if (insertError) {
                                        console.error('Error executing query', insertError.stack);
                                    }
                                    else {
                                        console.log('Employee added successfully');
                                        this.startCli(); // Restart the CLI after successful insertion
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
    }
    updateEmployeeRole(answers) {
        if (!answers) {
            inquirer
                .prompt([
                {
                    type: 'input',
                    name: 'employeeId',
                    message: 'Enter employee ID:',
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter new role ID:',
                },
            ])
                .then((answers) => {
                this.updateEmployeeRole(answers);
            });
        }
        else {
            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.roleId, answers.employeeId], (error) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                }
                else {
                    console.log('Employee role updated successfully');
                    this.startCli();
                }
            });
        }
    }
    viewAllEmployees() {
        pool.query('SELECT * FROM employee', (error, result) => {
            if (error) {
                console.error('Error executing query', error.stack);
            }
            else {
                console.table(result.rows);
                this.startCli();
            }
        });
    }
    startCli() {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View all Departments', 'Add Department'],
            },
        ])
            .then((answers) => {
            if (answers.action === 'View all Employees') {
                this.viewAllEmployees();
            }
            else if (answers.action === 'Add Employee') {
                this.addEmployee();
            }
            else if (answers.action === 'Update Employee Role') {
                this.updateEmployeeRole();
            }
            else if (answers.action === 'View all Roles') {
                this.viewAllRoles();
            }
            else if (answers.action === 'Add Role') {
                this.addRole();
            }
            else if (answers.action === 'View all Departments') {
                this.viewAllDepartments();
            }
            else if (answers.action === 'Add Department') {
                this.addDepartment();
            }
        });
    }
}
export default Cli;
