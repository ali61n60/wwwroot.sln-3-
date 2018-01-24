(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                suffix: "k"
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL1RlbXBlcmF0dXJlL3NyYy9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQyxvQ0FBb0M7QUFDckMsNkJBQTZCO0FBQzdCLHVCQUF1QjtBQUN2QixHQUFHOztBQUVIO0lBQUE7SUFRQSxDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQVJBLEFBUUMsSUFBQTtBQUVEO0lBQUE7SUFHQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVEO0lBT0k7UUFOaUIsZ0JBQVcsR0FBUSxrQkFBa0IsQ0FBQztRQUUvQyxrQkFBYSxHQUF1QixFQUFFLENBQUM7UUFDdkMsb0JBQWUsR0FBdUIsRUFBRSxDQUFDO1FBQ3pDLHFCQUFnQixHQUF1QixFQUFFLENBQUM7UUFHOUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRU8sbUNBQWMsR0FBdEI7UUFBQSxpQkFZQztRQVZHLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUF3QixDQUFDO1FBRXJFLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFXO1lBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtZQUNsRSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxXQUFXLENB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O0FBa0h2QixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2QsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFBLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly9ucG0gaW5zdGFsbCAtLXNhdmUgQHR5cGVzL2NhbnZhc2pzXHJcbi8vZGVjbGFyZSBtb2R1bGUgJ2NhbnZhc0pTJyB7XHJcbi8vICAgIGV4cG9ydCA9Q2FudmFzSlM7XHJcbi8vfVxyXG5cclxuY2xhc3MgU2luZ2xlVGVtcGVyYXR1cmUge1xyXG4gICAgcHVibGljIFRlbXBlcmF0dXJlSWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBEZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBIdW1pZGl0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIFZpZXdQb2ludDpudW1iZXI7XHJcblxyXG5cclxuICAgIHB1YmxpYyBJbnNlcnREYXRlVGltZTpudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIFNpbmdsZVBvaW50IHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGVtZXJhdHVyZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGFJbnB1dElkOnN0cmluZz1cImlucHV0VGVtcGVyYXR1cmVcIjtcclxuXHJcbiAgICBwcml2YXRlIF9kZWdyZWVQb2ludHM6IEFycmF5PFNpbmdsZVBvaW50PiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfaHVtaWRpdHlQb2ludHM6IEFycmF5PFNpbmdsZVBvaW50PiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfdmlld3BvaW50UG9pbnRzOiBBcnJheTxTaW5nbGVQb2ludD4gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXREYXRhUG9pbnRzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RGF0YVBvaW50cygpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGF0YVN0cmluZyA9ICQoXCIjXCIgKyB0aGlzLmRhdGFJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxUZW1wZXJhdHVyZXMgPSAkLnBhcnNlSlNPTihkYXRhU3RyaW5nKSBhcyBTaW5nbGVUZW1wZXJhdHVyZVtdO1xyXG5cclxuICAgICAgICBhbGxUZW1wZXJhdHVyZXMuZm9yRWFjaCgodGVtcGVyYXR1cmUpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0ZW1wZXJhdHVyZS5JbnNlcnREYXRlVGltZSk7IC8vIHNvbWUgbW9jayBkYXRlXHJcbiAgICAgICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkYXRlLmdldFRpbWUoKTsgXHJcbiAgICAgICAgICAgIHRoaXMuX2RlZ3JlZVBvaW50cy5wdXNoKHsgeDogbWlsbGlzZWNvbmRzLCB5OiB0ZW1wZXJhdHVyZS5EZWdyZWUgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2h1bWlkaXR5UG9pbnRzLnB1c2goeyB4OiBtaWxsaXNlY29uZHMsIHk6IHRlbXBlcmF0dXJlLkh1bWlkaXR5IH0pO1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3cG9pbnRQb2ludHMucHVzaCh7IHg6IG1pbGxpc2Vjb25kcywgeTogdGVtcGVyYXR1cmUuVmlld1BvaW50IH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgXHJcbiAgICBwcml2YXRlIGRyYXcoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBkZ3JlZUNoYXJ0ID0gbmV3IENhbnZhc0pTLkNoYXJ0KFwiZGVncmVlQ29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi2K/ZhdinXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiy2YXYp9mGXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiv2YXYp1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeDogXCJDXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJDUFUgVXRpbGl6YXRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdE51bGxEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL251bGxEYXRhTGluZURhc2hUeXBlOiBcInNvbGlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhWYWx1ZVR5cGU6IFwiZGF0ZVRpbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlRm9ybWF0U3RyaW5nOiBcIkREIE1NTSBoaDptbSBUVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5VmFsdWVGb3JtYXRTdHJpbmc6IFwiIywjIzAuIyNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVBvaW50czogdGhpcy5fZGVncmVlUG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBsZXQgaHVtaWRpdHlDaGFydCA9IG5ldyBDYW52YXNKUy5DaGFydChcImh1bWlkaXR5Q29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi2LHYt9mI2KjYqlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXhpc1g6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCLYstmF2KfZhlwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXhpc1k6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCLYsdi32YjYqNiqXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VmZml4OiBcIiVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibGluZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkNQVSBVdGlsaXphdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0TnVsbERhdGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbnVsbERhdGFMaW5lRGFzaFR5cGU6IFwic29saWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlVHlwZTogXCJkYXRlVGltZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4VmFsdWVGb3JtYXRTdHJpbmc6IFwiREQgTU1NIGhoOm1tIFRUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlWYWx1ZUZvcm1hdFN0cmluZzogXCIjLCMjMC4jI1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhUG9pbnRzOiB0aGlzLl9odW1pZGl0eVBvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHZpZXdQb2ludENoYXJ0ID0gbmV3IENhbnZhc0pTLkNoYXJ0KFwidmlld1BvaW50Q29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi2YbZgti32Ycg2LTYqNmG2YVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNYOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwi2LLZhdin2YZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwi2YbZgti32Ycg2LTYqNmG2YVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWZmaXg6IFwia1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJsaW5lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQ1BVIFV0aWxpemF0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3ROdWxsRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9udWxsRGF0YUxpbmVEYXNoVHlwZTogXCJzb2xpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4VmFsdWVUeXBlOiBcImRhdGVUaW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhWYWx1ZUZvcm1hdFN0cmluZzogXCJERCBNTU0gaGg6bW0gVFRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeVZhbHVlRm9ybWF0U3RyaW5nOiBcIiMsIyMwLiMjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFQb2ludHM6IHRoaXMuX3ZpZXdwb2ludFBvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGdyZWVDaGFydC5yZW5kZXIoKTtcclxuICAgICAgICBodW1pZGl0eUNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIHZpZXdQb2ludENoYXJ0LnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICBsZXQgdGVtZXJhdHVyZSA9IG5ldyBUZW1lcmF0dXJlKCk7XHJcbn0pOy8vcmVhZHlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19
