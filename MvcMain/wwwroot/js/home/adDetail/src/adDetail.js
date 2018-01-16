"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdDetail = (function () {
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
//# sourceMappingURL=adDetail.js.map