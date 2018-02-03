function enumDemo() {
    var Temperature;
    (function (Temperature) {
        Temperature[Temperature["Cold"] = 0] = "Cold";
        Temperature[Temperature["Hot"] = 1] = "Hot";
    })(Temperature || (Temperature = {}));
    ;
    var temp = Temperature.Cold;
    if (temp == Temperature.Cold) {
        console.log("Brrr...");
    }
    else if (temp == Temperature.Hot) {
        console.log("yikes!!");
    }
}
enumDemo();
//# sourceMappingURL=enumDemo.js.map