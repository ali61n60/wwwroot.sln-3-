Type.registerNamespace("Demo");

// Define an enumeration type and register it.
Demo.Color = function () { };
Demo.Color.prototype =
{
    Red: "rgb(255,0,0)",
    Blue:"rgb(0,0,255)",
Green:"rgb(0,255,0)",
White: "rgb(255,255,255)"
}
Demo.Color.registerEnum("Demo.Color");

