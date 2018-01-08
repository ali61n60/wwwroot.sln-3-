(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
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
    //    =[{ x: 1501048673000, y: 35.939 },
    //    { x: 1501052273000, y: 40.896 },
    //    { x: 1501055873000, y: 56.625 },
    //    { x: 1501059473000, y: 26.003 },
    //    { x: 1501063073000, y: 20.376 },
    //    { x: 1501066673000, y: 19.774 },
    //    { x: 1501070273000, y: 23.508 },
    //    { x: 1501073873000, y: 18.577 },
    //    { x: 1501077473000, y: 15.918 },
    //    { x: 1501081073000, y: null }, // Null Data
    //    { x: 1501084673000, y: 10.314 },
    //    { x: 1501088273000, y: 10.574 },
    //    { x: 1501091873000, y: 14.422 },
    //    { x: 1501095473000, y: 18.576 },
    //    { x: 1501099073000, y: 22.342 },
    //    { x: 1501102673000, y: 22.836 },
    //    { x: 1501106273000, y: 23.220 },
    //    { x: 1501109873000, y: 23.594 },
    //    { x: 1501113473000, y: 24.596 },
    //    { x: 1501117073000, y: 31.947 },
    //    { x: 1501120673000, y: 31.142 },
    //    { x: 111, y: 100 }
    //];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL1RlbXBlcmF0dXJlL3NyYy9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUM7SUFBQTtJQUlELENBQUM7SUFBRCx3QkFBQztBQUFELENBSkMsQUFJQSxJQUFBO0FBRUQ7SUFBQTtJQUdBLENBQUM7SUFBRCxrQkFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBRUQ7SUFHSTtRQUZpQixnQkFBVyxHQUFRLGtCQUFrQixDQUFDO1FBbUIvQyxnQkFBVyxHQUFxQixFQUFFLENBQUU7UUFoQnhDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVPLG1DQUFjLEdBQXRCO1FBQUEsaUJBVUM7UUFSRyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1RCxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBd0IsQ0FBQztRQUVyRSxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsV0FBVztZQUNoQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7WUFDbEUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0Qsd0NBQXdDO0lBQ3hDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsaURBQWlEO0lBQ2pELHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsd0JBQXdCO0lBQ3hCLElBQUk7SUFFSSx5QkFBSSxHQUFaO1FBRUksSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUMzQztZQUNJLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxLQUFLO2FBQ2Q7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsS0FBSyxFQUFFLE1BQU07YUFDaEI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLEdBQUc7YUFDZDtZQUNELElBQUksRUFBRTtnQkFDRjtvQkFDSSxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsaUJBQWlCO29CQUN2QixlQUFlLEVBQUUsSUFBSTtvQkFDckIsZ0NBQWdDO29CQUNoQyxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsa0JBQWtCLEVBQUUsaUJBQWlCO29CQUNyQyxrQkFBa0IsRUFBRSxVQUFVO29CQUM5QixVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUJBQy9CO2FBQ0o7U0FDSixDQUFDLENBQUM7UUFDUCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0EzRUEsQUEyRUMsSUFBQTtBQTNFWSxnQ0FBVTtBQTZFdkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNkLElBQUksVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2NsYXNzIFNpbmdsZVRlbXBlcmF0dXJlIHtcclxuICAgIHB1YmxpYyB0ZW1wZXJhdHVyZUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGVtcDogbnVtYmVyO1xyXG4gICAgcHVibGljIGluc2VydERhdGVUaW1lOm51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgU2luZ2xlUG9pbnQge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1lcmF0dXJlIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGF0YUlucHV0SWQ6c3RyaW5nPVwiaW5wdXRUZW1wZXJhdHVyZVwiO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXREYXRhUG9pbnRzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RGF0YVBvaW50cygpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGF0YVN0cmluZyA9ICQoXCIjXCIgKyB0aGlzLmRhdGFJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxUZW1wZXJhdHVyZXMgPSAkLnBhcnNlSlNPTihkYXRhU3RyaW5nKSBhcyBTaW5nbGVUZW1wZXJhdHVyZVtdO1xyXG5cclxuICAgICAgICBhbGxUZW1wZXJhdHVyZXMuZm9yRWFjaCgodGVtcGVyYXR1cmUpID0+IHtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0ZW1wZXJhdHVyZS5pbnNlcnREYXRlVGltZSk7IC8vIHNvbWUgbW9jayBkYXRlXHJcbiAgICAgICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkYXRlLmdldFRpbWUoKTsgXHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFQb2ludHMucHVzaCh7IHg6IG1pbGxpc2Vjb25kcyAsIHk6IHRlbXBlcmF0dXJlLnRlbXAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGF0YVBvaW50czogQXJyYXk8U2luZ2xlUG9pbnQ+PVtdIDtcclxuICAgIC8vICAgID1beyB4OiAxNTAxMDQ4NjczMDAwLCB5OiAzNS45MzkgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTA1MjI3MzAwMCwgeTogNDAuODk2IH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDEwNTU4NzMwMDAsIHk6IDU2LjYyNSB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMDU5NDczMDAwLCB5OiAyNi4wMDMgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTA2MzA3MzAwMCwgeTogMjAuMzc2IH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDEwNjY2NzMwMDAsIHk6IDE5Ljc3NCB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMDcwMjczMDAwLCB5OiAyMy41MDggfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTA3Mzg3MzAwMCwgeTogMTguNTc3IH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDEwNzc0NzMwMDAsIHk6IDE1LjkxOCB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMDgxMDczMDAwLCB5OiBudWxsIH0sIC8vIE51bGwgRGF0YVxyXG4gICAgLy8gICAgeyB4OiAxNTAxMDg0NjczMDAwLCB5OiAxMC4zMTQgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTA4ODI3MzAwMCwgeTogMTAuNTc0IH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDEwOTE4NzMwMDAsIHk6IDE0LjQyMiB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMDk1NDczMDAwLCB5OiAxOC41NzYgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTA5OTA3MzAwMCwgeTogMjIuMzQyIH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDExMDI2NzMwMDAsIHk6IDIyLjgzNiB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMTA2MjczMDAwLCB5OiAyMy4yMjAgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTEwOTg3MzAwMCwgeTogMjMuNTk0IH0sXHJcbiAgICAvLyAgICB7IHg6IDE1MDExMTM0NzMwMDAsIHk6IDI0LjU5NiB9LFxyXG4gICAgLy8gICAgeyB4OiAxNTAxMTE3MDczMDAwLCB5OiAzMS45NDcgfSxcclxuICAgIC8vICAgIHsgeDogMTUwMTEyMDY3MzAwMCwgeTogMzEuMTQyIH0sXHJcbiAgICAvLyAgICB7IHg6IDExMSwgeTogMTAwIH1cclxuICAgIC8vXTtcclxuXHJcbiAgICBwcml2YXRlIGRyYXcoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9IG5ldyBDYW52YXNKUy5DaGFydChcImNoYXJ0Q29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi2K/ZhdinXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiy2YXYp9mGXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzWToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcItiv2YXYp1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeDogXCJDXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJDUFUgVXRpbGl6YXRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdE51bGxEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL251bGxEYXRhTGluZURhc2hUeXBlOiBcInNvbGlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhWYWx1ZVR5cGU6IFwiZGF0ZVRpbWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlRm9ybWF0U3RyaW5nOiBcIkREIE1NTSBoaDptbSBUVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5VmFsdWVGb3JtYXRTdHJpbmc6IFwiIywjIzAuIyNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVBvaW50czogdGhpcy5fZGF0YVBvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCB0ZW1lcmF0dXJlID0gbmV3IFRlbWVyYXR1cmUoKTtcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=
