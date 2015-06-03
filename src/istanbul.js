var path = require('path')
var istanbul = require('istanbul')
var mkdirp = require('mkdirp')
var fs = require('fs')
var utility = require('./utility')
var instrumenter = new istanbul.Instrumenter()

function instrumentFiles(files, dir, filename, callback) {
  var count = files.length, isrc = []

  if(!utility.isDirectory(dir))
    mkdirp(dir)

  files.forEach(function(file, index) {
    fs.readFile(file, function(error, contents) {
      if(error)
        return console.error(error)

      try {
        // must keep glob file order
        isrc[index] = instrumenter.instrumentSync(contents.toString(), file)
      }
      catch(e) {
        console.error('Unable to instrument', file)
      }

      if(--count === 0) {
        fs.writeFile(dir +'/'+ filename, isrc.join(';'), callback)
      }
    })
  })
}

function writeReport(dir, data, reporters, callback) {
  var collector = new istanbul.Collector()
  var reporter = new istanbul.Reporter(false, dir)
  var sync = false

  // No Istanbul report data to write or no reporters selected
  if(!data[0] || !reporters) {
    console.log('No Istanbul report generated')
    return callback()
  }

  collector.add(data[0]) // istanbul report is always only 1

  reporter.addAll(reporters)

  reporter.write(collector, sync, function () {
    console.log('Istanbul report generated at', path.relative('.', dir))
    callback()
  })
}

module.exports = {
  instrumentFiles: instrumentFiles,
  writeReport: writeReport
}