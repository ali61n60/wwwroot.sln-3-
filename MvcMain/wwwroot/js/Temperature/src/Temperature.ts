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

    private draw(): void {

        var chart = new CanvasJS.Chart("chartContainer",
            {
                animationEnabled: true,
                title: {
                    text: "Hourly Average CPU Utilization"
                },
                axisX: {
                    title: "Time"
                },
                axisY: {
                    title: "Percentage",
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
                        yValueFormatString: "#,##0.##\"%\"",
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






