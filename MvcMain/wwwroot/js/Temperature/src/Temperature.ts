﻿class SingleTemperature {
    public temperatureId: number;
    public temp: number;
    public insertDateTime:number;
}

class SinglePoint {
    public x: number;
    public y: number;
}

export class Temerature {
    private readonly dataInputId:string="inputTemperature";
    
    constructor() {
        this.initDataPoints();
        this.draw();
    }

    private initDataPoints(): void {
        
        let dataString = $("#" + this.dataInputId).val().toString();
        let allTemperatures = $.parseJSON(dataString) as SingleTemperature[];

        allTemperatures.forEach((temperature) => {
            var date = new Date(temperature.insertDateTime); // some mock date
            var milliseconds = date.getTime(); 
            this._dataPoints.push({ x: milliseconds , y: temperature.temp });
        });
    }

    private _dataPoints: Array<SinglePoint>=[] ;
   
    private draw(): void {

        var chart = new CanvasJS.Chart("chartContainer",
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
                        dataPoints: this._dataPoints
                    }
                ]
            });
        chart.render();
    }
}

$(document).ready(() => {
    let temerature = new Temerature();
});//ready






