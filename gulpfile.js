var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-babel-minify');
var webserver = require('gulp-webserver');

const input = {
  scss: './source/css/*.scss',
  js: './source/js/*.js',
  images: './source/images/*'
}

const output = {
  scss: './assets/css',
  js: './assets/js',
  images: './assets/images/'
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
  return gulp
    .src(input.scss)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(output.scss))
    .resume();
});

gulp.task("js", () => {
  return gulp.src(input.js)
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest(output.js));
  }
);

gulp.task('clone', function () {
  return gulp.src(input.images)
      .pipe(gulp.dest(output.images));
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            path: '/',
            port: 5000
        }));

    gulp.watch(input.scss, gulp.series('sass'));
    gulp.watch(input.js, gulp.series('js'));
    gulp.watch("*.html");
});

gulp.task('build', gulp.series('clone', 'sass', 'js', function () {
  return gulp
    .src(input.scss)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output.scss));
}));

gulp.task('default', gulp.series(['webserver'], function() { 
  // default task code here
}));