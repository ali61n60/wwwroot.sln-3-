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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL1RlbXBlcmF0dXJlL3NyYy9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQyxvQ0FBb0M7QUFDckMsNkJBQTZCO0FBQzdCLHVCQUF1QjtBQUN2QixHQUFHOztBQUVIO0lBQUE7SUFJQSxDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUpBLEFBSUMsSUFBQTtBQUVEO0lBQUE7SUFHQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVEO0lBR0k7UUFGaUIsZ0JBQVcsR0FBUSxrQkFBa0IsQ0FBQztRQW1CL0MsZ0JBQVcsR0FBcUIsRUFBRSxDQUFFO1FBaEJ4QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxtQ0FBYyxHQUF0QjtRQUFBLGlCQVVDO1FBUkcsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUQsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQXdCLENBQUM7UUFFckUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFdBQVc7WUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1lBQ2xFLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUlPLHlCQUFJLEdBQVo7UUFFSSxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQzNDO1lBQ0ksZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLEtBQUs7YUFDZDtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsTUFBTTthQUNoQjtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsR0FBRzthQUNkO1lBQ0QsSUFBSSxFQUFFO2dCQUNGO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLGVBQWUsRUFBRSxJQUFJO29CQUNyQixnQ0FBZ0M7b0JBQ2hDLFVBQVUsRUFBRSxVQUFVO29CQUN0QixrQkFBa0IsRUFBRSxpQkFBaUI7b0JBQ3JDLGtCQUFrQixFQUFFLFVBQVU7b0JBQzlCLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVztpQkFDL0I7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUNQLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQXBEQSxBQW9EQyxJQUFBO0FBcERZLGdDQUFVO0FBc0R2QixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2QsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFBLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly9ucG0gaW5zdGFsbCAtLXNhdmUgQHR5cGVzL2NhbnZhc2pzXHJcbi8vZGVjbGFyZSBtb2R1bGUgJ2NhbnZhc0pTJyB7XHJcbi8vICAgIGV4cG9ydCA9Q2FudmFzSlM7XHJcbi8vfVxyXG5cclxuY2xhc3MgU2luZ2xlVGVtcGVyYXR1cmUge1xyXG4gICAgcHVibGljIHRlbXBlcmF0dXJlSWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0ZW1wOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaW5zZXJ0RGF0ZVRpbWU6bnVtYmVyO1xyXG59XHJcblxyXG5jbGFzcyBTaW5nbGVQb2ludCB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlbWVyYXR1cmUge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkYXRhSW5wdXRJZDpzdHJpbmc9XCJpbnB1dFRlbXBlcmF0dXJlXCI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdERhdGFQb2ludHMoKTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXREYXRhUG9pbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkYXRhU3RyaW5nID0gJChcIiNcIiArIHRoaXMuZGF0YUlucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbFRlbXBlcmF0dXJlcyA9ICQucGFyc2VKU09OKGRhdGFTdHJpbmcpIGFzIFNpbmdsZVRlbXBlcmF0dXJlW107XHJcblxyXG4gICAgICAgIGFsbFRlbXBlcmF0dXJlcy5mb3JFYWNoKCh0ZW1wZXJhdHVyZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRlbXBlcmF0dXJlLmluc2VydERhdGVUaW1lKTsgLy8gc29tZSBtb2NrIGRhdGVcclxuICAgICAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGRhdGUuZ2V0VGltZSgpOyBcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVBvaW50cy5wdXNoKHsgeDogbWlsbGlzZWNvbmRzICwgeTogdGVtcGVyYXR1cmUudGVtcCB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9kYXRhUG9pbnRzOiBBcnJheTxTaW5nbGVQb2ludD49W10gO1xyXG4gICBcclxuICAgIHByaXZhdGUgZHJhdygpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGNoYXJ0ID0gbmV3IENhbnZhc0pTLkNoYXJ0KFwiY2hhcnRDb250YWluZXJcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCLYr9mF2KdcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNYOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwi2LLZhdin2YZcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNZOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwi2K/ZhdinXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VmZml4OiBcIkNcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibGluZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkNQVSBVdGlsaXphdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0TnVsbERhdGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbnVsbERhdGFMaW5lRGFzaFR5cGU6IFwic29saWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlVHlwZTogXCJkYXRlVGltZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4VmFsdWVGb3JtYXRTdHJpbmc6IFwiREQgTU1NIGhoOm1tIFRUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlWYWx1ZUZvcm1hdFN0cmluZzogXCIjLCMjMC4jI1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhUG9pbnRzOiB0aGlzLl9kYXRhUG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgbGV0IHRlbWVyYXR1cmUgPSBuZXcgVGVtZXJhdHVyZSgpO1xyXG59KTsvL3JlYWR5XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
