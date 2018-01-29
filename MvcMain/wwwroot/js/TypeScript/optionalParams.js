function add(num1, num2, num3) {
    var total = num1 + num2;
    if (num3 != undefined) {
        total += num3;
    }
    return total;
}
var answer = add(10, 20, 30);
console.log("adding three numbers: " + answer);
answer = add(10, 25);
console.log("adding two numbers: " + answer);
//# sourceMappingURL=optionalParams.js.map