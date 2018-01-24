//npm install --save @types/canvasjs
//declare module 'canvasJS' {
//    export =CanvasJS;
//}

class SingleTemperature {
    public TemperatureId: number;
    public Degree: number;
    public Humidity: number;
    public ViewPoint:number;


    public InsertDateTime:number;
}

class SinglePoint {
    public x: number;
    public y: number;
}

export class Temerature {
    private readonly dataInputId:string="inputTemperature";

    private _degreePoints: Array<SinglePoint> = [];
    private _humidityPoints: Array<SinglePoint> = [];
    private _viewpointPoints: Array<SinglePoint> = [];

    constructor() {
        this.initDataPoints();
        this.draw();
    }

    private initDataPoints(): void {
        
        let dataString = $("#" + this.dataInputId).val().toString();
        let allTemperatures = $.parseJSON(dataString) as SingleTemperature[];

        allTemperatures.forEach((temperature) => {
            var date = new Date(temperature.InsertDateTime); // some mock date
            var milliseconds = date.getTime(); 
            this._degreePoints.push({ x: milliseconds, y: temperature.Degree });
            this._humidityPoints.push({ x: milliseconds, y: temperature.Humidity });
            this._viewpointPoints.push({ x: milliseconds, y: temperature.ViewPoint });
        });
    }

    
    
    private draw(): void {

        let dgreeChart = new CanvasJS.Chart("degreeContainer",
            {
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
        let humidityChart = new CanvasJS.Chart("humidityContainer",
            {
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
        let viewPointChart = new CanvasJS.Chart("viewPointContainer",
            {
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
    }
}

$(document).ready(() => {
    let temerature = new Temerature();
});//ready






