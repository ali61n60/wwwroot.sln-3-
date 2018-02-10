function person(value) {
    switch (typeof value) {
        case "string":
            return "my name is " + value + ".";
        case "number":
            return "I am " + value + " years old.";
        case "boolean":
            return value ? "I am married" : "I am not married";
    }
    return "";
}
var personAnswer = person("Ali Nejati");
console.log(personAnswer);
personAnswer = person(34);
console.log(personAnswer);
personAnswer = person(true);
console.log(personAnswer);
//# sourceMappingURL=overloading.js.map