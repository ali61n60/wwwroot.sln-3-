function person(name: string): string;
function person(age: number): string;
function person(isMarried: boolean): string;
function person(value: (string | number | boolean)): string {
    switch (typeof value) {
        case "string":
            return `my name is ${value}.`;
        case "number":
            return `I am ${value} years old.`;
        case "boolean":
            return value ? "I am married" : "I am not married";
    }
    return "";
}

let personAnswer = person("Ali Nejati");
console.log(personAnswer);
personAnswer = person(34);
console.log(personAnswer);

personAnswer = person(true);
console.log(personAnswer);