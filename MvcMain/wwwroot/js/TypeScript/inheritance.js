var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student(firstName, lastName, email, age, grade) {
        var _this = _super.call(this, firstName, lastName, email, age) || this;
        _this.grade = grade;
        return _this;
    }
    Student.prototype.greetMe = function () {
        _super.prototype.greetMe.call(this);
        console.log("I am in the " + this.grade + " grade");
    };
    return Student;
}(Person));
var student = new Student("Ali", "Nejati", "ali62n62@yahoo.com", 35, "6th");
student.greetMe();
//# sourceMappingURL=inheritance.js.map