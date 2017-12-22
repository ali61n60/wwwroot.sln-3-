(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* The dispatcher handles the storage of subsciptions and facilitates
  subscription, unsubscription and dispatching of the event */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this._subscriptions = new Array();
    }
    EventDispatcher.prototype.Subscribe = function (fn) {
        if (fn) {
            this._subscriptions.push(fn);
        }
    };
    EventDispatcher.prototype.Unsubscribe = function (fn) {
        var i = this._subscriptions.indexOf(fn);
        if (i > -1) {
            this._subscriptions.splice(i, 1);
        }
    };
    EventDispatcher.prototype.dispatch = function (sender, args) {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(sender, args);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../EventDispatcher");
var PulseGenerator = /** @class */ (function () {
    function PulseGenerator(frequencyInHz) {
        //create private event dispatcher
        this._onPulsate = new EventDispatcher_1.EventDispatcher();
        this.FrequencyInHz = frequencyInHz;
        this.start();
    }
    Object.defineProperty(PulseGenerator.prototype, "onPulsate", {
        //expose the event dispatcher through the IEvent interface
        //this will hide the dispatch method outside the class
        get: function () {
            return this._onPulsate;
        },
        enumerable: true,
        configurable: true
    });
    PulseGenerator.prototype.start = function () {
        var _this = this;
        setTimeout(function () {
            _this.start();
            //dispatch event by calling the dispatcher 
            _this._onPulsate.dispatch(_this, _this.FrequencyInHz);
        }, 1000 / this.FrequencyInHz);
    };
    return PulseGenerator;
}());
var generator = new PulseGenerator(0.5);
//subscribe on the onPulse event
generator.onPulsate.Subscribe(function (p, hz) {
    //play beep:
    var snd = new Audio("data:audio/wav;base64,UklGRkYDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSIDAAAAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAACJNO5T2lKKMgAAys50sYeyydAAAOMtK0kYSOQrAABx1Ta8Sr1v1wAAPCdoPlU9PiUAABfc+cYMyBbeAACWIKYzkjKXHgAAveK70c/SvOQAAO8Z4yjQJ/EXAABk6X7ckd1j6wAASRMhHg0dShEAAArwQedU6AnyAACjDF4TSxKkCgAAsfYD8hfzr/gAAPwFnAiIB/0DAABX/cb82f1W/wAA");
    snd.play();
});
//change frequency
window.setTimeout(function () {
    generator.FrequencyInHz = 0.2;
}, 3000);
},{"../EventDispatcher":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FeGFtcGxlcy9QdWxzZUdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7OERBQzhEO0FBQzlEO0lBQUE7UUFFWSxtQkFBYyxHQUFrRCxJQUFJLEtBQUssRUFBMEMsQ0FBQztJQW9CaEksQ0FBQztJQWxCRyxtQ0FBUyxHQUFULFVBQVUsRUFBMEM7UUFDaEQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0lBRUQscUNBQVcsR0FBWCxVQUFZLEVBQTBDO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBUSxHQUFSLFVBQVMsTUFBZSxFQUFFLElBQVc7UUFDakMsR0FBRyxDQUFDLENBQWdCLFVBQW1CLEVBQW5CLEtBQUEsSUFBSSxDQUFDLGNBQWMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7WUFBbEMsSUFBSSxPQUFPLFNBQUE7WUFDWixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F0QkEsQUFzQkMsSUFBQTtBQXRCYSwwQ0FBZTs7OztBQ0w1QixzREFBcUQ7QUFHdEQ7SUFXSSx3QkFBWSxhQUFxQjtRQVZqQyxpQ0FBaUM7UUFDekIsZUFBVSxHQUE0QyxJQUFJLGlDQUFlLEVBQTBCLENBQUM7UUFVeEcsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFQRCxzQkFBSSxxQ0FBUztRQUZiLDBEQUEwRDtRQUMxRCxzREFBc0Q7YUFDdEQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQU9PLDhCQUFLLEdBQWI7UUFBQSxpQkFVQztRQVJHLFVBQVUsQ0FBQztZQUVQLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUViLDJDQUEyQztZQUMzQyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXZELENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTCxxQkFBQztBQUFELENBM0JBLEFBMkJDLElBQUE7QUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV4QyxnQ0FBZ0M7QUFDaEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDLEVBQUUsRUFBRTtJQUVoQyxZQUFZO0lBQ1osSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsZ29DQUFnb0MsQ0FBQyxDQUFDO0lBQ3RwQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQjtBQUNsQixNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2QsU0FBUyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDbEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwiLi4vRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IElFdmVudCB9IGZyb20gXCIuLi9JRXZlbnRcIjtcclxuXHJcbmNsYXNzIFB1bHNlR2VuZXJhdG9yIHtcclxuICAgIC8vY3JlYXRlIHByaXZhdGUgZXZlbnQgZGlzcGF0Y2hlclxyXG4gICAgcHJpdmF0ZSBfb25QdWxzYXRlOiBFdmVudERpc3BhdGNoZXI8UHVsc2VHZW5lcmF0b3IsIG51bWJlcj4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPFB1bHNlR2VuZXJhdG9yLCBudW1iZXI+KCk7XHJcbiAgICBwdWJsaWMgIEZyZXF1ZW5jeUluSHo6IG51bWJlcjtcclxuXHJcbiAgICAvL2V4cG9zZSB0aGUgZXZlbnQgZGlzcGF0Y2hlciB0aHJvdWdoIHRoZSBJRXZlbnQgaW50ZXJmYWNlXHJcbiAgICAvL3RoaXMgd2lsbCBoaWRlIHRoZSBkaXNwYXRjaCBtZXRob2Qgb3V0c2lkZSB0aGUgY2xhc3NcclxuICAgIGdldCBvblB1bHNhdGUoKTogSUV2ZW50PFB1bHNlR2VuZXJhdG9yLCBudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25QdWxzYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZyZXF1ZW5jeUluSHo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRnJlcXVlbmN5SW5IeiA9IGZyZXF1ZW5jeUluSHo7XHJcbiAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnQoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgLy9kaXNwYXRjaCBldmVudCBieSBjYWxsaW5nIHRoZSBkaXNwYXRjaGVyIFxyXG4gICAgICAgICAgICB0aGlzLl9vblB1bHNhdGUuZGlzcGF0Y2godGhpcywgdGhpcy5GcmVxdWVuY3lJbkh6KTtcclxuXHJcbiAgICAgICAgfSwgMTAwMCAvIHRoaXMuRnJlcXVlbmN5SW5Ieik7XHJcbiAgICB9XHJcbn1cclxuXHJcbnZhciBnZW5lcmF0b3IgPSBuZXcgUHVsc2VHZW5lcmF0b3IoMC41KTtcclxuXHJcbi8vc3Vic2NyaWJlIG9uIHRoZSBvblB1bHNlIGV2ZW50XHJcbmdlbmVyYXRvci5vblB1bHNhdGUuU3Vic2NyaWJlKChwLCBoeikgPT4ge1xyXG5cclxuICAgIC8vcGxheSBiZWVwOlxyXG4gICAgdmFyIHNuZCA9IG5ldyBBdWRpbyhcImRhdGE6YXVkaW8vd2F2O2Jhc2U2NCxVa2xHUmtZREFBQlhRVlpGWm0xMElCQUFBQUFCQUFFQVFCOEFBSUErQUFBQ0FCQUFaR0YwWVNJREFBQUFBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUNKTk81VDJsS0tNZ0FBeXM1MHNZZXl5ZEFBQU9NdEswa1lTT1FyQUFCeDFUYThTcjF2MXdBQVBDZG9QbFU5UGlVQUFCZmMrY1lNeUJiZUFBQ1dJS1l6a2pLWEhnQUF2ZUs3MGMvU3ZPUUFBTzhaNHlqUUovRVhBQUJrNlg3Y2tkMWo2d0FBU1JNaEhnMGRTaEVBQUFyd1FlZFU2QW55QUFDakRGNFRTeEtrQ2dBQXNmWUQ4aGZ6ci9nQUFQd0ZuQWlJQi8wREFBQlgvY2I4MmYxVy93QUFcIik7XHJcbiAgICBzbmQucGxheSgpO1xyXG59KTtcclxuXHJcbi8vY2hhbmdlIGZyZXF1ZW5jeVxyXG53aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICBnZW5lcmF0b3IuRnJlcXVlbmN5SW5IeiA9IDAuMjtcclxufSwgMzAwMCk7Il19