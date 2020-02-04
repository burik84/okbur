'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var paths = {
  build: {
    html: 'dist/',
    htmlblog: 'dist/blog/',
    js: 'dist/js/',
    style: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
    slickfonts: 'dist/css/fonts/',
  },
  src: {
    html: 'src/html/*.html',
    htmlblog: 'src/html/blog/*.html',
    js: 'src/js/*.js',
    style: 'src/scss/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/*.*',
    slickfonts: 'src/fonts/slick/*.*',
    static: 'src/static/**/*.*'
  },
  watch: {
    html: 'src/html/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/scss/**/*.scss'
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
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const tildeImporter = require('node-sass-tilde-importer');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');

sass.compiler = require('node-sass');

// удаление папки сборки dist
function clean() {
  return del(paths.clean)
}
// удаление кэша
function clear() {
  return cache.clearAll()
}

function image() {
  return gulp.src(paths.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.build.img));
}

function filefonts() {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.build.fonts));
}

function fileslick() {
  return gulp.src(paths.src.slickfonts)
    .pipe(gulp.dest(paths.build.slickfonts));
}

function filestatic() {
  return gulp.src(paths.src.static)
    .pipe(gulp.dest(paths.baseDir));
}

function html() {
  return gulp.src(paths.src.html)
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) //Прогоним через rigger - собираем файлы template в один
    .pipe(gulp.dest(paths.build.html)) // выкладывание готовых файлов
    .pipe(browserSync.stream()); // перезагрузка сервера
}

function htmlMin() {
  return gulp.src(paths.src.html)
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) //Прогоним через rigger - собираем файлы template в один
    .pipe(htmlmin({
      collapseWhitespace: true
    })) //удаляем все лишнее и минимизируем файлы
    .pipe(gulp.dest(paths.build.html)) // выкладывание готовых файлов
    .pipe(browserSync.stream()); // перезагрузка сервера
}

//Сборка html файлов для блога - из папки в папку блог!!!
function htmlblog() {
  return gulp.src(paths.src.htmlblog)
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) //Прогоним через rigger - собираем файлы template в один
    .pipe(gulp.dest(paths.build.htmlblog)) // выкладывание готовых файлов
    .pipe(browserSync.stream()); // перезагрузка сервера
}

function htmlblogMin() {
  return gulp.src(paths.src.htmlblog)
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) //Прогоним через rigger - собираем файлы template в один
    .pipe(htmlmin({
      collapseWhitespace: true
    })) //удаляем все лишнее и минимизируем файлы
    .pipe(gulp.dest(paths.build.htmlblog)) // выкладывание готовых файлов
    .pipe(browserSync.stream()); // перезагрузка сервера
}
// Если у нас на входе несколько файлов scss, то plumber и concat я не использую.
function styles() {
  return gulp.src(paths.src.style) // получим main.scss
    .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter
    }).on('error', sass.logError)) // scss -> css + импорт из nodemodules c использованием ~
    // .pipe(concat('style.css'))
    .pipe(autoprefixer({ // добавим префиксы
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.build.style)) // выгружаем в build
    .pipe(browserSync.stream()); // перезагрузим сервер
}

function stylesMin() {
  return gulp.src(paths.src.style) // получим main.scss
    .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter
    }).on('error', sass.logError)) // scss -> css + импорт из nodemodules c использованием ~
    // .pipe(concat('style.css'))
    .pipe(autoprefixer({ // добавим префиксы
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 1
    })) //Проверяем если у нас prod то удаляем все лишнее и минимизируем файлы
    .pipe(gulp.dest(paths.build.style)) // выгружаем в build
    .pipe(browserSync.stream()); // перезагрузим сервер
}

// Работа с файлами JS
function script() {
  return gulp.src(paths.src.js, {
      sourcemaps: true
    })
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.build.js)); // Выгружаем в папку
}

function scriptMin() {
  return gulp.src(paths.src.js, {
      sourcemaps: true
    })
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.build.js)); // Выгружаем в папку
}

// Работа с установленными библиотеками JS
function scriptApp() {
  return gulp.src([ // Берем все необходимые библиотеки
      'node_modules/jquery/dist/jquery.js', // Берем jQuery
      'node_modules/slick-carousel/slick/slick.js' // Берем Magnific Popup
    ])
    .pipe(concat('app.min.js')) // Собираем их в кучу в новом файле libs.min.js
    .pipe(gulp.dest(paths.build.js)); // Выгружаем в папку
}

function scriptAppMin() {
  return gulp.src([ // Берем все необходимые библиотеки
      'node_modules/jquery/dist/jquery.min.js', // Берем jQuery
      'node_modules/slick-carousel/slick/slick.min.js' // Берем Magnific Popup
    ])
    .pipe(concat('app.min.js')) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest(paths.build.js)); // Выгружаем в папку
}

// Инкрементальная сборка - пересборка если изменился файлы
function watch() {
  browserSync.init({
    server: paths.baseDir
  });
  gulp.watch(paths.watch.html, html);
  gulp.watch(paths.watch.html, htmlblog);
  gulp.watch(paths.watch.style, styles);
  gulp.watch(paths.watch.js, script);
}
exports.clean = clean;
exports.clear = clear;
exports.styles = styles;
exports.html = html;
exports.htmlblog = htmlblog;
exports.script = script;
exports.scriptApp = scriptApp;
exports.watch = watch;
exports.image = image;
exports.filefonts = filefonts;
exports.filestatic = filestatic;
exports.fileslick = fileslick;


exports.stylesMin = stylesMin;
exports.htmlMin = htmlMin;
exports.htmlblogMin = htmlblogMin;
exports.scriptAppMin = scriptAppMin;
exports.scriptMin = scriptMin;

// сборка для тестирования
gulp.task('build',
  gulp.series(clean,
    clear,
    image,
    filefonts,
    filestatic,
    fileslick,
    htmlblog,
    scriptApp,
    gulp.parallel(
      html,
      styles,
      script
    )
  )
);

// сборка для публикации - с минификацией файлов
gulp.task('prod',
  gulp.series(clean,
    clear,
    image,
    filefonts,
    filestatic,
    fileslick,
    htmlblogMin,
    scriptAppMin,
    gulp.parallel(
      htmlMin,
      stylesMin,
      scriptMin
    )
  )
);
// Сборка заданий в одно общее - server для тестирование верстки
gulp.task('server', gulp.series('build', watch));