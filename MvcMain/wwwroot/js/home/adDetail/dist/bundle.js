(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdDetail = /** @class */ (function () {
    function AdDetail() {
        $("#imageGallery").lightSlider({
            gallery: true,
            item: 1,
            loop: true,
            thumbItem: 9,
            slideMargin: 0,
            enableDrag: false,
            currentPagerPosition: 'left',
            onSliderLoad: function (el) {
                el.lightGallery({
                    selector: '#imageGallery .lslide'
                });
            }
        });
    }
    return AdDetail;
}());
exports.AdDetail = AdDetail;
$(document).ready(function () {
    new AdDetail();
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL2hvbWUvYWREZXRhaWwvc3JjL2FkRGV0YWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQztJQUNHO1FBQ0ksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsQ0FDMUI7WUFDSSxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxFQUFFLElBQUk7WUFDVixTQUFTLEVBQUUsQ0FBQztZQUNaLFdBQVcsRUFBRSxDQUFDO1lBQ2QsVUFBVSxFQUFFLEtBQUs7WUFDakIsb0JBQW9CLEVBQUUsTUFBTTtZQUM1QixZQUFZLEVBQUUsVUFBUyxFQUFFO2dCQUNyQixFQUFFLENBQUMsWUFBWSxDQUFDO29CQUNaLFFBQVEsRUFBRSx1QkFBdUI7aUJBQ3BDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0wsZUFBQztBQUFELENBbEJDLEFBa0JBLElBQUE7QUFsQmEsNEJBQVE7QUFvQnRCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDZCxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUNKLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/ZXhwb3J0IGNsYXNzIEFkRGV0YWlsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICQoXCIjaW1hZ2VHYWxsZXJ5XCIpLmxpZ2h0U2xpZGVyKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnYWxsZXJ5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaXRlbTogMSxcclxuICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aHVtYkl0ZW06IDksXHJcbiAgICAgICAgICAgICAgICBzbGlkZU1hcmdpbjogMCxcclxuICAgICAgICAgICAgICAgIGVuYWJsZURyYWc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2VyUG9zaXRpb246ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAgIG9uU2xpZGVyTG9hZDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5saWdodEdhbGxlcnkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJyNpbWFnZUdhbGxlcnkgLmxzbGlkZSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIG5ldyBBZERldGFpbCgpO1xyXG4gICAgfVxyXG4pOyJdfQ==
