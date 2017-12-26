var tran;
(function (tran) {
    var MyClass = (function () {
        function MyClass() {
        }
        MyClass.prototype.MyMethod = function () {
            console.log("my method of transformation");
        };
        return MyClass;
    }());
    tran.MyClass = MyClass;
})(tran || (tran = {}));
//# sourceMappingURL=AdTransformationSearchCriteria.js.map