var Person2 = /** @class */ (function () {
    function Person2(fisrtName, lastName, email, age) {
        this.fisrtName = fisrtName;
        this.lastName = lastName;
        this.email = email;
        this.age = age;
    }
    Person2.prototype.greetMe = function () {
        console.log("Hello " + this.fisrtName + " " + this.lastName);
    };
    return Person2;
}());
var p2 = new Person2("Ali", "Nejati", "ali62n62@yahoo.com", 35);
p2.greetMe();
//# sourceMappingURL=classes2.js.map