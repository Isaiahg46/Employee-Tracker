class Employee {
    firstName: string;
    lastName: string;
    roleId: number;
    managerId: number;
    
    constructor(firstName: string, lastName: string, roleId: number, managerId: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleId = roleId;
        this.managerId = managerId;
    }
}

export default Employee;
