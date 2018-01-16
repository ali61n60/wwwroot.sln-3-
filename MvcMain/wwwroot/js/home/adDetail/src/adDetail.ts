export class AdDetail {
    constructor() {
        $("#imageGallery").lightSlider(
            {
                gallery: true,
                item: 1,
                loop: true,
                thumbItem: 9,
                slideMargin: 0,
                enableDrag: false,
                currentPagerPosition: 'left',
                onSliderLoad: function(el) {
                    el.lightGallery({
                        selector: '#imageGallery .lslide'
                    });
                }
            });
    }
}

$(document).ready(() => {
    new AdDetail();
    }
);