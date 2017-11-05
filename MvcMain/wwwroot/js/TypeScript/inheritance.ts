class Student extends Person {
    private grade: string;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        age: number,
        grade:string
    ) 
    {
        super(firstName, lastName, email, age);
        this.grade = grade;
    }

    greetMe():void {
        super.greetMe();
        console.log(`I am in the ${this.grade} grade`);
    }
}

let student = new Student("Ali", "Nejati", "ali62n62@yahoo.com", 35, "6th");
student.greetMe();