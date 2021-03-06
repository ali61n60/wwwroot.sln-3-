//npm install--save @types/mustache hello
var Person = /** @class */ (function () {
    function Person(fn, ln, email, age) {
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.age = age;
    }
    Object.defineProperty(Person.prototype, "Age", {
        get: function () { return this.age; },
        set: function (value) { this.age = value; },
        enumerable: true,
        configurable: true
    });
    Person.prototype.greetMe = function () {
        console.log("Hello " + this.firstName + " " + this.lastName);
    };
    return Person;
}());
var p = new Person("Ali", "Nejati", "ali62n62@yahoo.com", 35);
p.greetMe();
//# sourceMappingURL=classes.js.map