var def;
(function (def) {
    var MyClass = (function () {
        function MyClass() {
        }
        MyClass.prototype.MyMethod = function () {
            console.log("my method of default");
        };
        return MyClass;
    }());
    def.MyClass = MyClass;
})(def || (def = {}));
//# sourceMappingURL=DefaultSearchCriteria.js.map