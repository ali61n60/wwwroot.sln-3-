function addWithRest(num1:number,num2:number, ...numbers:number[]):number {
    let result = num1 + num2;
    for (let i = 0; i < numbers.length; i++) {
        result += numbers[i];
    }
    return result;
}

let restAnswer = addWithRest(1, 2, 3, 4, 5, 6, 7, 8, 9);
console.log("multiple addition result is: " + restAnswer);