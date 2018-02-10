"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../EventDispatcher");
var PulseGenerator = (function () {
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
//# sourceMappingURL=PulseGenerator.js.map