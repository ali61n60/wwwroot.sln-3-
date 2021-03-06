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
    EventDispatcher.prototype.Dispatch = function (sender, args) {
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
            _this._onPulsate.Dispatch(_this, _this.FrequencyInHz);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FeGFtcGxlcy9QdWxzZUdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7OERBQzhEO0FBQzlEO0lBQUE7UUFFWSxtQkFBYyxHQUFrRCxJQUFJLEtBQUssRUFBMEMsQ0FBQztJQW9CaEksQ0FBQztJQWxCVSxtQ0FBUyxHQUFoQixVQUFpQixFQUEwQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUM7SUFFTyxxQ0FBVyxHQUFuQixVQUFvQixFQUEwQztRQUMxRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDO0lBRU8sa0NBQVEsR0FBaEIsVUFBaUIsTUFBZSxFQUFFLElBQVc7UUFDekMsR0FBRyxDQUFDLENBQWdCLFVBQW1CLEVBQW5CLEtBQUEsSUFBSSxDQUFDLGNBQWMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7WUFBbEMsSUFBSSxPQUFPLFNBQUE7WUFDWixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F0QkEsQUFzQkMsSUFBQTtBQXRCYSwwQ0FBZTs7OztBQ0w1QixzREFBcUQ7QUFHdEQ7SUFXSSx3QkFBWSxhQUFxQjtRQVZqQyxpQ0FBaUM7UUFDekIsZUFBVSxHQUE0QyxJQUFJLGlDQUFlLEVBQTBCLENBQUM7UUFVeEcsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFQRCxzQkFBSSxxQ0FBUztRQUZiLDBEQUEwRDtRQUMxRCxzREFBc0Q7YUFDdEQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQU9PLDhCQUFLLEdBQWI7UUFBQSxpQkFVQztRQVJHLFVBQVUsQ0FBQztZQUVQLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUViLDJDQUEyQztZQUMzQyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXZELENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTCxxQkFBQztBQUFELENBM0JBLEFBMkJDLElBQUE7QUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV4QyxnQ0FBZ0M7QUFDaEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDLEVBQUUsRUFBRTtJQUVoQyxZQUFZO0lBQ1osSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsZ29DQUFnb0MsQ0FBQyxDQUFDO0lBQ3RwQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDZixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQjtBQUNsQixNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2QsU0FBUyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDbEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBwdWJsaWMgU3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIERpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSBcIi4uL0lFdmVudFwiO1xyXG5cclxuY2xhc3MgUHVsc2VHZW5lcmF0b3Ige1xyXG4gICAgLy9jcmVhdGUgcHJpdmF0ZSBldmVudCBkaXNwYXRjaGVyXHJcbiAgICBwcml2YXRlIF9vblB1bHNhdGU6IEV2ZW50RGlzcGF0Y2hlcjxQdWxzZUdlbmVyYXRvciwgbnVtYmVyPiA9IG5ldyBFdmVudERpc3BhdGNoZXI8UHVsc2VHZW5lcmF0b3IsIG51bWJlcj4oKTtcclxuICAgIHB1YmxpYyAgRnJlcXVlbmN5SW5IejogbnVtYmVyO1xyXG5cclxuICAgIC8vZXhwb3NlIHRoZSBldmVudCBkaXNwYXRjaGVyIHRocm91Z2ggdGhlIElFdmVudCBpbnRlcmZhY2VcclxuICAgIC8vdGhpcyB3aWxsIGhpZGUgdGhlIGRpc3BhdGNoIG1ldGhvZCBvdXRzaWRlIHRoZSBjbGFzc1xyXG4gICAgZ2V0IG9uUHVsc2F0ZSgpOiBJRXZlbnQ8UHVsc2VHZW5lcmF0b3IsIG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblB1bHNhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZnJlcXVlbmN5SW5IejogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5GcmVxdWVuY3lJbkh6ID0gZnJlcXVlbmN5SW5IejtcclxuICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgICAgICAvL2Rpc3BhdGNoIGV2ZW50IGJ5IGNhbGxpbmcgdGhlIGRpc3BhdGNoZXIgXHJcbiAgICAgICAgICAgIHRoaXMuX29uUHVsc2F0ZS5EaXNwYXRjaCh0aGlzLCB0aGlzLkZyZXF1ZW5jeUluSHopO1xyXG5cclxuICAgICAgICB9LCAxMDAwIC8gdGhpcy5GcmVxdWVuY3lJbkh6KTtcclxuICAgIH1cclxufVxyXG5cclxudmFyIGdlbmVyYXRvciA9IG5ldyBQdWxzZUdlbmVyYXRvcigwLjUpO1xyXG5cclxuLy9zdWJzY3JpYmUgb24gdGhlIG9uUHVsc2UgZXZlbnRcclxuZ2VuZXJhdG9yLm9uUHVsc2F0ZS5TdWJzY3JpYmUoKHAsIGh6KSA9PiB7XHJcblxyXG4gICAgLy9wbGF5IGJlZXA6XHJcbiAgICB2YXIgc25kID0gbmV3IEF1ZGlvKFwiZGF0YTphdWRpby93YXY7YmFzZTY0LFVrbEdSa1lEQUFCWFFWWkZabTEwSUJBQUFBQUJBQUVBUUI4QUFJQStBQUFDQUJBQVpHRjBZU0lEQUFBQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQXpOUlZXRlZZek5RQUF6Y3JycWV1cHpjb0FBRE0xRlZZVlZqTTFBQUROeXV1cDY2bk55Z0FBTXpVVlZoVldNelVBQU0zSzY2bnJxYzNLQUFBek5SVldGVll6TlFBQXpjcnJxZXVwemNvQUFETTFGVllWVmpNMUFBRE55dXVwNjZuTnlnQUFNelVWVmhWV016VUFBTTNLNjZucnFjM0tBQUF6TlJWV0ZWWXpOUUFBemNycnFldXB6Y29BQURNMUZWWVZWak0xQUFETnl1dXA2Nm5OeWdBQU16VVZWaFZXTXpVQUFNM0s2Nm5ycWMzS0FBQ0pOTzVUMmxLS01nQUF5czUwc1lleXlkQUFBT010SzBrWVNPUXJBQUJ4MVRhOFNyMXYxd0FBUENkb1BsVTlQaVVBQUJmYytjWU15QmJlQUFDV0lLWXpraktYSGdBQXZlSzcwYy9Tdk9RQUFPOFo0eWpRSi9FWEFBQms2WDdja2QxajZ3QUFTUk1oSGcwZFNoRUFBQXJ3UWVkVTZBbnlBQUNqREY0VFN4S2tDZ0FBc2ZZRDhoZnpyL2dBQVB3Rm5BaUlCLzBEQUFCWC9jYjgyZjFXL3dBQVwiKTtcclxuICAgIHNuZC5wbGF5KCk7XHJcbn0pO1xyXG5cclxuLy9jaGFuZ2UgZnJlcXVlbmN5XHJcbndpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgIGdlbmVyYXRvci5GcmVxdWVuY3lJbkh6ID0gMC4yO1xyXG59LCAzMDAwKTsiXX0=
