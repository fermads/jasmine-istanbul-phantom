var gulp = require('gulp')
var jip = require('../src')
var changedSpec = null

/*
 * Run all specs, then, on watch:
 *  if a spec changes, run only that spec
 *  if src changes, run all specs
 */

gulp.task('test', function(done) {
  var options = { callback: done }

  if (changedSpec)
    options.spec = changedSpec

  jip(options)

  changedSpec = null
})

gulp.task('watch', function() {
  gulp.watch('src/*.js').on('change', function() {
    gulp.start('test')
  })

  gulp.watch('test/spec/*.js').on('change', function(event){
    changedSpec = event.path
    gulp.start('test')
  })
})

gulp.task('default', ['test', 'watch'])