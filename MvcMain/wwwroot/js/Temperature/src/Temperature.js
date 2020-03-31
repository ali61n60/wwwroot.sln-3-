"use strict";
//npm install --save @types/canvasjs
//declare module 'canvasJS' {
//    export =CanvasJS;
//}
Object.defineProperty(exports, "__esModule", { value: true });
var SingleTemperature = /** @class */ (function () {
    function SingleTemperature() {
    }
    return SingleTemperature;
}());
var SinglePoint = /** @class */ (function () {
    function SinglePoint() {
    }
    return SinglePoint;
}());
var Temerature = /** @class */ (function () {
    function Temerature() {
        this.dataInputId = "inputTemperature";
        this._degreePoints = [];
        this._humidityPoints = [];
        this._viewpointPoints = [];
        this.initDataPoints();
        //this.draw();
    }
    Temerature.prototype.initDataPoints = function () {
        var _this = this;
        var dataString = $("#" + this.dataInputId).val().toString();
        var allTemperatures = $.parseJSON(dataString);
        allTemperatures.forEach(function (temperature) {
            var date = new Date(temperature.InsertDateTime); // some mock date
            var milliseconds = date.getTime();
            _this._degreePoints.push({ x: milliseconds, y: temperature.Degree });
            _this._humidityPoints.push({ x: milliseconds, y: temperature.Humidity });
            _this._viewpointPoints.push({ x: milliseconds, y: temperature.ViewPoint });
        });
    };
    return Temerature;
}());
exports.Temerature = Temerature;
$(document).ready(function () {
    var temerature = new Temerature();
}); //ready
//# sourceMappingURL=Temperature.js.map