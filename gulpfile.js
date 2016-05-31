var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache');

var minifyHtmlOpts = {
    empty: true,
    cdata: true,
    conditionals: true,
    spare: true,
    quotes: true
};

gulp.task('templates-bootstrap2', function () {
    gulp.src('template/bootstrap2/**/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('blog-tpls-bootstrap2.js', {standalone: true, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('templates-bootstrap3', function () {
    gulp.src('template/bootstrap3/**/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('blog-tpls-bootstrap3.js', {standalone: true, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('unavailable-bootstrap3', function () {
    gulp.src('template/bootstrap3/unavailable/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('blog-unavailable-tpls-bootstrap3.js', {standalone: true, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('clerk-templates-bootstrap3', function () {
    gulp.src('template/clerk/bootstrap3/**/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('blog-clerk-tpls-bootstrap3.js', {standalone: false, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['templates-bootstrap2', 'templates-bootstrap3', 'unavailable-bootstrap3', 'clerk-templates-bootstrap3']);