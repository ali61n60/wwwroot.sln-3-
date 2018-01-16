"use strict";
//npm install --save @types/canvasjs
//declare module 'canvasJS' {
//    export =CanvasJS;
//}
Object.defineProperty(exports, "__esModule", { value: true });
var SingleTemperature = (function () {
    function SingleTemperature() {
    }
    return SingleTemperature;
}());
var SinglePoint = (function () {
    function SinglePoint() {
    }
    return SinglePoint;
}());
var Temerature = (function () {
    function Temerature() {
        this.dataInputId = "inputTemperature";
        this._dataPoints = [];
        this.initDataPoints();
        this.draw();
    }
    Temerature.prototype.initDataPoints = function () {
        var _this = this;
        var dataString = $("#" + this.dataInputId).val().toString();
        var allTemperatures = $.parseJSON(dataString);
        allTemperatures.forEach(function (temperature) {
            var date = new Date(temperature.insertDateTime); // some mock date
            var milliseconds = date.getTime();
            _this._dataPoints.push({ x: milliseconds, y: temperature.temp });
        });
    };
    Temerature.prototype.draw = function () {
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "دما"
            },
            axisX: {
                title: "زمان"
            },
            axisY: {
                title: "دما",
                suffix: "C"
            },
            data: [
                {
                    type: "line",
                    name: "CPU Utilization",
                    connectNullData: true,
                    //nullDataLineDashType: "solid",
                    xValueType: "dateTime",
                    xValueFormatString: "DD MMM hh:mm TT",
                    yValueFormatString: "#,##0.##",
                    dataPoints: this._dataPoints
                }
            ]
        });
        chart.render();
    };
    return Temerature;
}());
exports.Temerature = Temerature;
$(document).ready(function () {
    var temerature = new Temerature();
}); //ready
//# sourceMappingURL=Temperature.js.map