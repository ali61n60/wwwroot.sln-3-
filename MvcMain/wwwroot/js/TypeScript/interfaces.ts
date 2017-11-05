interface IPhone {
    model: string;
    version: number;
    ring():string;
}

class TraditionalPhone implements IPhone {
    public  model: string;
    public  version: number;
    constructor(model: string, version: number) {
        this.model = model;
        this.version = version;
    }
    ring(): string {
        return `${this.model} is ringing. It is a traditional phone`;
    }
}

class ModernPhone implements IPhone {
    public model: string;
    public version: number;
    constructor(model: string, version: number) {
        this.model = model;
        this.version = version;
    }

    ring(): string {
        return `${this.model} is ringing. It is a modern phone`;
    }
}

let bellPhone = new TraditionalPhone("Bell", 12.4);
let iPhone = new ModernPhone("iPhone 7+", 1.0);

var phones: IPhone[]=[];
phones.push(bellPhone);
phones.push(iPhone);

for (var index of phones) {
    console.log(index.ring());
}


