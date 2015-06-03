var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var handlebars = require('handlebars')
var utility = require('./utility')

function writeReport(dir, data, reporters, callback) {
  var count = data.length

  // no jasmine report data to write or no valid reporter selected
  if(count === 0 || !reporters || reporters.indexOf('junit') === -1) {
    console.log('No Jasmine report generated')
    return callback()
  }

  if(!utility.isDirectory(dir))
    mkdirp(dir)

  var end = function() {
    if(--count === 0) {
      console.log('Jasmine report generated at', path.relative('.', dir))
      callback()
    }
  }

  for(var i in data) {
    var report = data[i]
    fs.writeFile(dir +'/'+ report.filename, report.text, end)
  }
}

function writeFixtures(filepath, fixtures) {
  var fixturesContent = {}
  for(var i in fixtures) {
    var file = fixtures[i]
    var name = path.basename(file)

    fixturesContent[name.replace(/\\/g, '/')] = fs.readFileSync(file).toString()
  }

  fs.writeFileSync(filepath, 'var _fixtures = '
    + JSON.stringify(fixturesContent) + ';function getFixture(path) {'
    + ' return path ? _fixtures[path] : _fixtures }')
}

function writeRunner(options, configs) {
  var source = fs.readFileSync(options.runner)
  var output = handlebars.compile(source.toString())(configs)
  fs.writeFileSync(options.phantom.runner, output)
}

module.exports = {
  writeReport: writeReport,
  writeFixtures: writeFixtures,
  writeRunner: writeRunner
}