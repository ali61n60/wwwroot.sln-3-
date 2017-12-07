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

gulp.task("default2", function () {
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