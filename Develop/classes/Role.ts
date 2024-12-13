class Roles {
    id: number;
    title: string;
    salary: number;
    departmentId: number;
    
    constructor(id: number, title: string, salary: number, departmentId: number) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }
}

export default Roles;