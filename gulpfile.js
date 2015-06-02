var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

gulp.task('default', function () {
  gulp.src([ // must load files in correct order
    'lib/phantom/phantom-polyfill.js',
    'lib/jasmine/jasmine.js',
    'lib/jasmine/jasmine-html.js',
    'lib/jasmine/junit_reporter.js',
    'lib/jasmine/terminal_reporter.js',
    'lib/jasmine/jasmine-html.js',
    'lib/jasmine/boot.js',
    'lib/jasmine/mock-ajax.js',
    'lib/jasmine/istanbul-reporter.js',
    'lib/jasmine/phantom-reporter.js',
    'lib/jasmine/configure-reporters.js'
  ])
  .pipe(uglify())
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('lib'))


  gulp.src([
    'lib/jasmine/jasmine.css',
    'lib/jasmine/jasmine-extra.css'
  ])
  .pipe(concat('styles.css'))
  .pipe(gulp.dest('lib'))

})
