var multiplyIt=function(num1: number, num2: number):number {
    return num1 * num2;
}

var multiplyItLambda = (num1: number, num2: number) => num1 * num2;

var sayFirstNumber: (firstNumber: number) => void;
sayFirstNumber=function(first: number) {
    console.log(first);
}

console.log(multiplyIt(5, 7));
console.log(multiplyItLambda(6, 9));
sayFirstNumber(15);