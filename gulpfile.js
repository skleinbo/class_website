var gulp = require('gulp');
var plumber = require("gulp-plumber");
var gl = require('gulp-less');
var del = require('del');
var { join } = require('path')
var log = require('fancy-log');

var nunjucksRender = require('gulp-nunjucks-render');
const { series, parallel } = require('gulp');
var browserSync    = require('browser-sync').create();

const DEVROOT  = ''
const DISTROOT = '~/skleinbo'

const BUILD_ENV = process.env.BUILD_ENV || 'dev';
const isdev = BUILD_ENV=='dev'
const output = isdev ? 'dev' : 'dist';
const root = isdev ? DEVROOT : DISTROOT;

log(`Building '${output}'.`)

// Copy these folders over
// to dev / dist
const assetFolders = ['+(css|material|fonts|img)/**/*'];


function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

function render(done) {
    // render nunjucks and static html
    return gulp.src('pages/**/*.+(html|nunjucks|njk)')
    .pipe(plumber())
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: ['templates'],
        data: {
            root: root
        }
    }))
    // output files in app folder
    .pipe(gulp.dest(output))
}

function less(done) {
    let stream = gulp.src('less/default.less')
    .pipe(plumber(handleError))
    // less
    .pipe(gl())
    .pipe(gulp.dest(join(output,'css')))

    if(isdev){
        return stream.pipe(browserSync.stream())
    } else {
        return stream
    }
}

function javascript(done) {
    // Here we could lint, minify, etc...
    // our JS files before copying.
    return gulp.src('js/**/*.js')
    .pipe(gulp.dest(join(output,'js')))
}

function assets(done) {
    // Preparatory work on our assets
    // Copy
    return gulp.src(assetFolders)
    .pipe(gulp.dest(output))
}


function clean_all(done){
  return del(['dev/**/*', 'dist/**/*']);
}


function serve(done) {
    return browserSync.init({
        server: {
            baseDir: ['dev', 'dist']
        }
    });
};

function watch(done){
    gulp.watch(['templates/**/*.njk', 'pages/**/*.njk'], 
        gulp.series([render, function(done){
            browserSync.reload();
            done();
        }
        ])
    );
    gulp.watch('less/**/*.less', less);
    gulp.watch('js/**/*.js', javascript);
    gulp.watch(assetFolders, assets);
};


exports.assets = assets
exports.cleanall = clean_all;
exports.less = less;
exports.render = render;
exports.serve = serve;
if(isdev) {
    exports.default = series(
        less,
        javascript,
        assets,
        render,
        parallel(serve, watch)
    );
} else {
    exports.default = series(
        less,
        javascript,
        assets,
        render
    );
}
