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
        this._degreePoints = [];
        this._humidityPoints = [];
        this._viewpointPoints = [];
        this.initDataPoints();
        this.draw();
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
    Temerature.prototype.draw = function () {
        var dgreeChart = new CanvasJS.Chart("degreeContainer", {
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
                    dataPoints: this._degreePoints
                }
            ]
        });
        var humidityChart = new CanvasJS.Chart("humidityContainer", {
            animationEnabled: true,
            title: {
                text: "رطوبت"
            },
            axisX: {
                title: "زمان"
            },
            axisY: {
                title: "رطوبت",
                suffix: "%"
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
                    dataPoints: this._humidityPoints
                }
            ]
        });
        var viewPointChart = new CanvasJS.Chart("viewPointContainer", {
            animationEnabled: true,
            title: {
                text: "نقطه شبنم"
            },
            axisX: {
                title: "زمان"
            },
            axisY: {
                title: "نقطه شبنم",
                suffix: ""
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
                    dataPoints: this._viewpointPoints
                }
            ]
        });
        dgreeChart.render();
        humidityChart.render();
        viewPointChart.render();
    };
    return Temerature;
}());
exports.Temerature = Temerature;
$(document).ready(function () {
    var temerature = new Temerature();
}); //ready
//# sourceMappingURL=Temperature.js.map