var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('templates-bootstrap2', function () {
    gulp.src('template/bootstrap2/**/*.html')
        .pipe(minifyHtml())
        .pipe(templateCache('blog-tpls-bootstrap2.js', {standalone: true, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('templates-bootstrap3', function () {
    gulp.src('template/bootstrap3/**/*.html')
        .pipe(minifyHtml())
        .pipe(templateCache('blog-tpls-bootstrap3.js', {standalone: true, module: 'blog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['templates-bootstrap2', 'templates-bootstrap3']);