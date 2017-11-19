// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>

class MyTestClss {
    test(): void {
        alert("$ in jquery.d.ts is working");
    }
}

let myObject = new MyTestClss();
$(document).ready(() => {
    myObject.test();
});

