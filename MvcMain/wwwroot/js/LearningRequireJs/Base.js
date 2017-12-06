define(["require", "exports"], function (require, exports) {
    "use strict";
    var Base = (function () {
        function Base() {
        }
        Base.prototype.method1 = function () {
            alert("Base.Method1");
        };
        return Base;
    }());
    return Base;
});
//# sourceMappingURL=Base.js.map