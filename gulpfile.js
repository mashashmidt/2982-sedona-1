"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
// gulpfile.js
var minify = require('gulp-csso');
var gulpCopy = require('gulp-copy');
var imagemin = require("gulp-imagemin");


gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
      // includePaths: require('node-normalize-scss').with('other/path', 'another/path')
      // - or -
      includePaths: [require('node-normalize-scss').includePaths, 'sass/blocks']
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("serve", ["html", "img", 'fonts', 'js', "style"], function() {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task('html', function(){
  return gulp.src('./*.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('img', function(){
  return gulp.src('./img/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
      ]))
    .pipe(gulp.dest('build/img/'))
});

gulp.task('fonts', function(){
  return gulp.src('./fonts/*.{woff,woff2}')
    .pipe(gulp.dest('build/fonts/'))
});

gulp.task('js', function(){
  return gulp.src('./js/*.js')
    .pipe(gulp.dest('build/js/'))
});

gulp.task("css", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
      // includePaths: require('node-normalize-scss').with('other/path', 'another/path')
      // - or -
      includePaths: [require('node-normalize-scss').includePaths, 'sass/blocks']
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minify())
    .pipe(gulp.dest("build/css"))
});

gulp.task("build", ['html', 'img', 'fonts', 'js', "css"])
