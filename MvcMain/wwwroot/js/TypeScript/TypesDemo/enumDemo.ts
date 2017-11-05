function enumDemo() {
    enum  Temperature {
        Cold,
        Hot
    };

    let temp = Temperature.Cold;

    if (temp == Temperature.Cold) {
        console.log("Brrr...");
    }else if (temp == Temperature.Hot) {
        console.log("yikes!!");
    }
}

enumDemo();