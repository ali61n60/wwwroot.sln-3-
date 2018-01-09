(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//npm install --save @types/canvasjs
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL1RlbXBlcmF0dXJlL3NyYy9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsb0NBQW9DO0FBQ3JDO0lBQUE7SUFJQSxDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUpBLEFBSUMsSUFBQTtBQUVEO0lBQUE7SUFHQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVEO0lBR0k7UUFGaUIsZ0JBQVcsR0FBUSxrQkFBa0IsQ0FBQztRQW1CL0MsZ0JBQVcsR0FBcUIsRUFBRSxDQUFFO1FBaEJ4QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxtQ0FBYyxHQUF0QjtRQUFBLGlCQVVDO1FBUkcsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUQsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQXdCLENBQUM7UUFFckUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFdBQVc7WUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1lBQ2xFLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUlPLHlCQUFJLEdBQVo7UUFFSSxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQzNDO1lBQ0ksZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLEtBQUs7YUFDZDtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsTUFBTTthQUNoQjtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsR0FBRzthQUNkO1lBQ0QsSUFBSSxFQUFFO2dCQUNGO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLGVBQWUsRUFBRSxJQUFJO29CQUNyQixnQ0FBZ0M7b0JBQ2hDLFVBQVUsRUFBRSxVQUFVO29CQUN0QixrQkFBa0IsRUFBRSxpQkFBaUI7b0JBQ3JDLGtCQUFrQixFQUFFLFVBQVU7b0JBQzlCLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVztpQkFDL0I7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUNQLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQXBEQSxBQW9EQyxJQUFBO0FBcERZLGdDQUFVO0FBc0R2QixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2QsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFBLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly9ucG0gaW5zdGFsbCAtLXNhdmUgQHR5cGVzL2NhbnZhc2pzXHJcbmNsYXNzIFNpbmdsZVRlbXBlcmF0dXJlIHtcclxuICAgIHB1YmxpYyB0ZW1wZXJhdHVyZUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGVtcDogbnVtYmVyO1xyXG4gICAgcHVibGljIGluc2VydERhdGVUaW1lOm51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgU2luZ2xlUG9pbnQge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1lcmF0dXJlIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGF0YUlucHV0SWQ6c3RyaW5nPVwiaW5wdXRUZW1wZXJhdHVyZVwiO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXREYXRhUG9pbnRzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RGF0YVBvaW50cygpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGF0YVN0cmluZyA9ICQoXCIjXCIgKyB0aGlzLmRhdGFJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxUZW1wZXJhdHVyZXMgPSAkLnBhcnNlSlNPTihkYXRhU3RyaW5nKSBhcyBTaW5nbGVUZW1wZXJhdHVyZVtdO1xyXG5cclxuICAgICAgICBhbGxUZW1wZXJhdHVyZXMuZm9yRWFjaCgodGVtcGVyYXR1cmUpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0ZW1wZXJhdHVyZS5pbnNlcnREYXRlVGltZSk7IC8vIHNvbWUgbW9jayBkYXRlXHJcbiAgICAgICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkYXRlLmdldFRpbWUoKTsgXHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFQb2ludHMucHVzaCh7IHg6IG1pbGxpc2Vjb25kcyAsIHk6IHRlbXBlcmF0dXJlLnRlbXAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGF0YVBvaW50czogQXJyYXk8U2luZ2xlUG9pbnQ+PVtdIDtcclxuICAgXHJcbiAgICBwcml2YXRlIGRyYXcoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9IG5ldyBDYW52YXNKUy5DaGFydChcImNoYXJ0Q29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi2K/ZhdinXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiy2YXYp9mGXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiv2YXYp1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeDogXCJDXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJDUFUgVXRpbGl6YXRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdE51bGxEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL251bGxEYXRhTGluZURhc2hUeXBlOiBcInNvbGlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhWYWx1ZVR5cGU6IFwiZGF0ZVRpbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlRm9ybWF0U3RyaW5nOiBcIkREIE1NTSBoaDptbSBUVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5VmFsdWVGb3JtYXRTdHJpbmc6IFwiIywjIzAuIyNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVBvaW50czogdGhpcy5fZGF0YVBvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCB0ZW1lcmF0dXJlID0gbmV3IFRlbWVyYXR1cmUoKTtcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=
