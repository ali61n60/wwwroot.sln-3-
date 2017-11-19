//npm install--save @types/mustache hello
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

    greetMe():void {
        console.log(`Hello ${this.firstName} ${this.lastName}`);
    }
}

let p = new Person("Ali", "Nejati", "ali62n62@yahoo.com", 35);
p.greetMe();