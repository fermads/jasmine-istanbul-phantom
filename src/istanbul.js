var path = require('path')
var istanbul = require('istanbul')
var through = require('through2')
var instrumenter = new istanbul.Instrumenter()

function instrumentCode() {
  return through.obj(function(file, enc, cb) {
    if (!(file.contents instanceof Buffer))
      throw 'Streams not supported'

    instrumenter
    .instrument(file.contents.toString(), file.path, function (err, code) {
      if (err)
        throw 'Unable to parse ' + file.path + '\n\n' + err.message

      file.contents = new Buffer(code);
      cb(null, file)
    })
  })
}

function writeReport(dir, data, reporters, ee) {
  var collector = new istanbul.Collector()
  var reporter = new istanbul.Reporter(false, dir)
  var sync = false

  // No Istanbul report data to write or no reporters selected
  if(!data[0] || !reporters) {
    console.log('No Istanbul report generated')
    return ee.emit('end')
  }

  collector.add(data[0]) // istanbul report is always only 1

  reporter.addAll(reporters)

  reporter.write(collector, sync, function () {
    console.log('Istanbul report generated at', path.relative('.', dir))
    ee.emit('end')
  })
}

module.exports = {
  instrumentCode: instrumentCode,
  writeReport: writeReport
}