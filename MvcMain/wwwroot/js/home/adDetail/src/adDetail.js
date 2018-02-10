"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdDetail = (function () {
    function AdDetail() {
        $("#imageGallery").lightSlider({
            auto: true,
            pause: 5000,
            pager: true,
            gallery: true,
            item: 1,
            loop: true,
            thumbItem: 6,
            slideMargin: 0,
            enableDrag: true,
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
//<style>
//.lSPager li.active{
//    border: 5px blue double;
//}
//</style>
$(document).ready(function () {
    new AdDetail();
});
//# sourceMappingURL=adDetail.js.map