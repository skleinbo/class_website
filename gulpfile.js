var gulp = require('gulp');
var plumber = require("gulp-plumber");
const sass = require('gulp-sass')(require('sass'));
var del = require('del');
var { join } = require('path')
var log = require('fancy-log');
var prefixer = require('gulp-autoprefixer');

var nunjucksRender = require('gulp-nunjucks-render');
const { series, parallel } = require('gulp');
var browserSync    = require('browser-sync').create();

const DEVROOT  = process.env.ROOT || ''
const DISTROOT = process.env.ROOT || '/class_website'

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

function compilecss(done) {
    let stream = gulp.src(['sass/**/*.scss', '!sass/**/_*.scss'])
    // .pipe(plumber(handleError))
    .pipe(sass().on('error', sass.logError))
    // .pipe(prefixer())
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
    gulp.watch('sass/**/*.scss', compilecss);
    gulp.watch('js/**/*.js', javascript);
    gulp.watch(assetFolders, assets);
};


exports.assets = assets
exports.cleanall = clean_all;
exports.compilecss = compilecss;
exports.render = render;
exports.serve = serve;
if(isdev) {
    exports.default = series(
        parallel(compilecss,
        javascript,
        assets,
        render),
        parallel(serve, watch)
    );
} else {
    exports.default = series(
        compilecss,
        javascript,
        assets,
        render
    );
}
