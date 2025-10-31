/// <binding Clean='clean' />
"use strict";

const gulp = require("gulp");
const rimraf = require("rimraf");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");

// --- NEW: Dart Sass (replaces node-sass) ---
const dartSass = require("sass");
const gulpSass = require("gulp-sass")(dartSass);

const paths = {
  webroot: "./Tailspin.SpaceGame.Web/wwwroot/"
};

// Source assets
paths.scss = paths.webroot + "scss/**/*.scss";           // NEW: your .scss files
paths.cssDir = paths.webroot + "css";                    // NEW: compiled CSS output dir
paths.css = paths.cssDir + "/**/*.css";
paths.minCss = paths.cssDir + "/**/*.min.css";
paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";

// Bundle destinations
//test
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

// --- Clean tasks ---
gulp.task("clean:js", done => rimraf(paths.concatJsDest, done));
gulp.task("clean:css", done => rimraf(paths.concatCssDest, done));
gulp.task("clean", gulp.series("clean:js", "clean:css"));

// --- NEW: compile SCSS -> CSS (expanded, no min) ---
gulp.task("sass", () => {
  return gulp.src(paths.scss, { sourcemaps: false })
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(gulp.dest(paths.cssDir));
});

// --- Minify & bundle ---
gulp.task("min:js", () => {
  return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", () => {
  return gulp.src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cleanCSS())
    .pipe(gulp.dest("."));
});

// Build order: compile SCSS first, then minify
gulp.task("min", gulp.series("sass", "min:js", "min:css"));

// Default (required by Gulp v4)
gulp.task("default", gulp.series("min"));
