"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MyTestClss = (function () {
    function MyTestClss() {
    }
    MyTestClss.prototype.test = function () {
        alert("$ in jquery.d.ts is working");
    };
    return MyTestClss;
}());
exports.MyTestClss = MyTestClss;
var myObject = new MyTestClss();
$(document).ready(function () {
    myObject.test();
});
//# sourceMappingURL=testJquery.js.map