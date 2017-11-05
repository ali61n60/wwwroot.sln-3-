class Person {
    public firstName: string;
    public lastName: string;
    public email: string;
    private age: number;

    constructor(fn: string, ln: string, email: string, age: number) {
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.age = age;
    }
}