'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var paths = {
  build: {
    html: 'dist/',
    js: 'dist/js/',
    style: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    style: 'src/scss/style.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    service: 'src/service/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/scss/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'srs/fonts/**/*.*'
  },
  clean: 'dist',
  baseDir: 'dist'
};

// для выбора режимов необходимо
// режим отладки development разкомментировать
let isDev = true;
// режим production разкомментировать
// let isDev = false;
let isProd = !isDev;


const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const rigger = require('gulp-rigger');
const gulpif = require('gulp-if');
const tildeImporter = require('node-sass-tilde-importer');

sass.compiler = require('node-sass');

// удаление папки сборки dist
function clean() {
  return del(paths.clean);
}

function html() {
  return gulp.src(paths.src.html)
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulpif(isProd, htmlmin({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest(paths.build.html)) // выкладывание готовых файлов
    .pipe(browserSync.stream()); // перезагрузка сервера
}
// Если у нас на входе несколько файлов scss, то plumber и concat я не использую.
function styles() {
  return gulp.src(paths.src.style) // получим main.scss
    // .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter
    }).on('error', sass.logError)) // scss -> css + импорт из nodemodules c использованием ~
    // .pipe(concat('all.css'))
    .pipe(autoprefixer({ // добавим префиксы
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 1
    })))
    .pipe(gulp.dest(paths.build.style)) // выгружаем в build
    .pipe(browserSync.stream()); // перезагрузим сервер
}

// Инкрементальная сборка - пересборка если изменился файлы
function watch() {
  browserSync.init({
    server: paths.baseDir
  });
  gulp.watch(paths.watch.html, html);
  gulp.watch(paths.watch.style, styles);
}
exports.clean = clean;
exports.styles = styles;
exports.html = html;
exports.watch = watch;

// сборка
gulp.task('build',
  gulp.series(clean,
    gulp.parallel(
      html,
      styles
    )
  )
);

// Сборка заданий в одно общее -задача по умолчанию
gulp.task('default', gulp.series('build', watch));