var TraditionalPhone = /** @class */ (function () {
    function TraditionalPhone(model, version) {
        this.model = model;
        this.version = version;
    }
    TraditionalPhone.prototype.ring = function () {
        return this.model + " is ringing. It is a traditional phone";
    };
    return TraditionalPhone;
}());
var ModernPhone = /** @class */ (function () {
    function ModernPhone(model, version) {
        this.model = model;
        this.version = version;
    }
    ModernPhone.prototype.ring = function () {
        return this.model + " is ringing. It is a modern phone";
    };
    return ModernPhone;
}());
var bellPhone = new TraditionalPhone("Bell", 12.4);
var iPhone = new ModernPhone("iPhone 7+", 1.0);
var phones = [];
phones.push(bellPhone);
phones.push(iPhone);
for (var _i = 0, phones_1 = phones; _i < phones_1.length; _i++) {
    var index = phones_1[_i];
    console.log(index.ring());
}
//# sourceMappingURL=interfaces.js.map