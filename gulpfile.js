var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var exec = require('gulp-exec');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var cordova_plugins = require('./package.json').cordovaPlugins;
var Q = require('q');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');


console.log('hellllo ************************');

console.log(useref);

var paths = {
  sass: ['./scss/**/*.scss'],
  templateCache: ['./www/app/**/*.html'],
  ng_annotate: ['./www/app/**/*.js'],
  useref: ['./www/app/**/*.html'],
    ionicfonts: ['./www/lib/ionic/fonts/*']
};

 function transformUrl (url) {
    var split = url.split('/');
    var name = split[split.length-1];
    return name;
}

gulp.task('templatecache', function(done){
    gulp.src('./www/app/**/*.html')
        .pipe(templateCache({standalone:true, transformUrl: transformUrl}))
        .pipe(gulp.dest('./www/app'))
        .on('end', done);
});

gulp.task('ng_annotate', function (done) {
    gulp.src('./www/app/**/*.js')
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(gulp.dest('./www/dist/dist_js/app'))
        .on('end', done);
});

gulp.task('useref', function (done) {
    return gulp.src('./www/*.html')
        .pipe(useref())
        .pipe(gulp.dest('./www/dist'));
});

// Copy all other files to dist directly
gulp.task('copy', function() {
    // Copy ionic fonts
    gulp.src(paths.ionicfonts)
        .pipe(gulp.dest('./www/dist/fonts'));
});

gulp.task('default', ['sass','templatecache', 'ng_annotate', 'useref', 'copy']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.templateCache, ['templatecache']);
    gulp.watch(paths.ng_annotate, ['ng_annotate']);
    gulp.watch(paths.useref, ['useref']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
