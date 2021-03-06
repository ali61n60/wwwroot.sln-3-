/// <binding />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

//gulp.task("copy-html", function () {
//    return gulp.src(paths.pages)
//        .pipe(gulp.dest("dist"));
//});
gulp.task('default', function () {
    // place code for your default task here
});

gulp.task("LearnGulp", function () {
    return browserify({
        debug: true,
        entries: ["./wwwroot/js/LearnGulp/src/main.ts"],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./wwwroot/js/LearnGulp/dist"));
});

gulp.task("HomeIndex",
    function() {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/home/index/src/index.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/home/index/dist"));
    });

gulp.task("HomeNewAd",
    function () {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/home/newAd/src/newAd.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/home/newAd/dist"));
    });

gulp.task("AdDetail",
    function () {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/home/adDetail/src/adDetail.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/home/adDetail/dist"));
    });

gulp.task("LetMeKnow",
    function () {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/LetMeKnow/index/src/LetMeKnow.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/LetMeKnow/index/dist"));
    });

gulp.task("Temperature",
    function () {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/Temperature/src/Temperature.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/Temperature/dist"));
    });

gulp.task("EventExample",
    function() {
        return browserify({
                debug: true,
                entries: ["./wwwroot/js/Events/Examples/PulseGenerator.ts"],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./wwwroot/js/Events/Examples/dist"));
    });