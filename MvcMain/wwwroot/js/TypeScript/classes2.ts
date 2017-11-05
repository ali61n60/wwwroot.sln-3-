class Person2 {
    constructor(public fisrtName: string,
        public lastName: string,
        public email: string,
        private age: number
    ) {}

    greetMe() {
        console.log(`Hello ${this.fisrtName} ${this.lastName}`);
    }
}

let p2 = new Person2("Ali", "Nejati", "ali62n62@yahoo.com", 35);

p2.greetMe();