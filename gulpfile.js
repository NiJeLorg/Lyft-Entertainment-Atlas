'use strict';
const gulp = require('gulp'),
    path = require('path'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    pug = require('gulp-pug'),
    paths = {
        sassDirectory: 'app/sass/**/*.scss',
        pugDirectory: ['!app/shared/**', 'app/**/*.pug'],
        publicDirectory: './public/'
    };


gulp.task('pug2html', function() {
    gulp.src(paths.pugDirectory)
        .pipe(pug())
        .pipe(gulp.dest(paths.publicDirectory))
        .pipe(browserSync.stream());
});

gulp.task('sass2css', function() {
    gulp.src(paths.sassDirectory)
        .pipe(sass())
        .pipe(gulp.dest(path.join(paths.publicDirectory + 'css/')))
        .pipe(browserSync.stream());
});

gulp.task('nodemon', function() {
    nodemon({
            script: 'index.js',
            ext: 'js',
            ignore: ['public/', 'node_modules/']
        })
        .on('restart', function() {
            console.log('>> node restart');
        });
});

gulp.task('watch&reload', function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        port: 5000,
        browser: 'google chrome'
    });
    gulp.watch(paths.sassDirectory, ['sass2css']);
    gulp.watch(paths.pugDirectory, ['pug2html']);
});


gulp.task('build', ['pug2html', 'sass2css']);
gulp.task('default', ['nodemon', 'build', 'watch&reload']);
