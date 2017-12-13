import { EventDispatcher } from "../EventDispatcher";
import { IEvent } from "../IEvent";

class PulseGenerator {
    //create private event dispatcher
    private _onPulsate: EventDispatcher<PulseGenerator, number> = new EventDispatcher<PulseGenerator, number>();
    public  FrequencyInHz: number;

    //expose the event dispatcher through the IEvent interface
    //this will hide the dispatch method outside the class
    get onPulsate(): IEvent<PulseGenerator, number> {
        return this._onPulsate;
    }

    constructor(frequencyInHz: number) {
        this.FrequencyInHz = frequencyInHz;
        this.start();
    }

    private start(): void {

        setTimeout(() => {

            this.start();

            //dispatch event by calling the dispatcher 
            this._onPulsate.dispatch(this, this.FrequencyInHz);

        }, 1000 / this.FrequencyInHz);
    }
}

var generator = new PulseGenerator(0.5);

//subscribe on the onPulse event
generator.onPulsate.Subscribe((p, hz) => {

    //play beep:
    var snd = new Audio("data:audio/wav;base64,UklGRkYDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSIDAAAAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAAAzNRVWFVYzNQAAzcrrqeupzcoAADM1FVYVVjM1AADNyuup66nNygAAMzUVVhVWMzUAAM3K66nrqc3KAACJNO5T2lKKMgAAys50sYeyydAAAOMtK0kYSOQrAABx1Ta8Sr1v1wAAPCdoPlU9PiUAABfc+cYMyBbeAACWIKYzkjKXHgAAveK70c/SvOQAAO8Z4yjQJ/EXAABk6X7ckd1j6wAASRMhHg0dShEAAArwQedU6AnyAACjDF4TSxKkCgAAsfYD8hfzr/gAAPwFnAiIB/0DAABX/cb82f1W/wAA");
    snd.play();
});

//change frequency
window.setTimeout(function () {
    generator.FrequencyInHz = 0.2;
}, 3000);