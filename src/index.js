var path = require('path')
var globby = require('globby')
var vfs = require('vinyl-fs')
var events = require('events')

var phantom = require('./phantom')
var jasmine = require('./jasmine')
var utility = require('./utility')
var istanbul = require('./istanbul')

var globOptions = {
  realpath: true,
  nodir: true
}

var configs = { // spec runner's handlebars template variables
  src: [], spec: [], lib: [],
  fixture: '', jasmine: { js:'', css:'' }
}

function getBasePath(base) {
  if(base && utility.isDirectory(base))
    return base
  else if(base && !utility.isDirectory(base))
    throw 'Base path does not exist: '+ base
  else if(utility.isDirectory('test'))
    return 'test'
  else if(utility.isDirectory('tests'))
    return 'tests'
  else
    throw 'No base path found. Set base options.'
}

function extendDefaults(options) {
  var libpath = __dirname +'/../lib'
  options = options || {}
  options.base = getBasePath(options.base)

  var defaults = { // default options
    src: 'src/**/*.js',
    lib: ['lib/**/*.js', 'vendor?(s)/**/*.js'],
    tmp: options.base +'/tmp',
    spec: options.base +'/spec?(s)/**/*.js',
    runner: libpath +'/jasmine/SpecRunner.html',
    fixture: options.base +'/fixture/*',
    callback: null,
    // url: 'http://localhost/',
    jasmine: {
      js: libpath +'/scripts.js',
      css: libpath +'/styles.css',
      report: options.base +'/report/unit',
      fixture: 'fixture.js', // fixture filename
      reporters: ['terminal', 'junit']
    },
    istanbul: {
      isrc: 'isrc', // instrumented code dir name
      report: options.base +'/report/coverage',
      reporters: ['text-summary', 'lcov', 'clover']
    },
    phantom: {
      bin: '',
      api: libpath +'/phantom/phantom-api.js',
      verbose: false,
      params: {}
    }
  }

  return utility.extend(defaults, options)
}

function init(options) {
  var isrc = []
  options = extendDefaults(options)

  vfs.src(options.src, globOptions)
    .pipe(istanbul.instrumentCode())
    .pipe(vfs.dest(options.tmp +'/'+ options.istanbul.isrc))
    .on('data', function(file) {
      isrc.push(file.history[file.history.length -1])
    })
    .on('end', function() {
      if(isrc.length === 0)
        return console.error('No src files found')
      configs.src = isrc
      addSpecs(options)
    })

  return options
}

function addSpecs(options) {
  globby(options.spec, globOptions, function (error, files) {
    if(error)
      return console.error(error)

    configs.spec = files

    if(configs.spec.length === 0)
      return console.error('No spec files found at '+ options.spec)

    addLibs(options)
  })
}

function addLibs(options) {
  globby(options.lib || '', globOptions, function (error, files) {
    if(error)
      return console.error(error)

    configs.lib = files

    addFixtures(options)
  })
}

function addFixtures(options) {
  globby(options.fixture || '', globOptions, function (error, files) {
    if(error)
      return console.error(error)

    configs.fixture = path.resolve(options.tmp +'/'+ options.jasmine.fixture)
    jasmine.writeFixtures(configs.fixture, files)

    addRunner(options)
  })
}

function addFileProtocol(configs) {
  for(var i in configs) {
    if(typeof configs[i] == 'string')
      configs[i] = 'file:///'+ configs[i]
    else
      addFileProtocol(configs[i])
  }
}

function addRunner(options) {
  if(!utility.isFile(options.runner))
    return console.error('Spec runner not found at '+ options.runner)

  // jasmine lib path
  configs.jasmine.js = path.normalize(options.jasmine.js)
  configs.jasmine.css = path.normalize(options.jasmine.css)

  // final spec runner's file path. The one phantom will use
  options.phantom.runner = path.resolve(options.tmp +'/'+
    path.basename(options.runner))

  if(!options.url) // using file:// and not a http server
    addFileProtocol(configs) // phantomjs 2.0 requires file:// for file urls

  jasmine.writeRunner(options, configs)

  runPhantom(options)
}

function runPhantom(options) {
  if(options.phantom && options.phantom.bin) { // phantom bin option provided
    if(!utility.isFile(options.phantom.bin))
      return console.error('Phantomjs binary not found at '+
        options.phantom.bin)
  }
  else { // use npm phantomjs
    options.phantom.bin = require('phantomjs').path
  }

  phantom.run(options.phantom, function onEnd(reports) {
    writeReports(reports, options)
  })
}

function writeReports(reports, options) {
  var istanbulReportData = [], jasmineReportData = [], reportsCount = 0
  var ee = new events.EventEmitter()

  for(var i = 0; i < reports.length; i++) {
    if(reports[i].istanbulReportResult) {
      istanbulReportData.push(reports[i].istanbulReportResult)
    }
    else if(reports[i].junitReportResult) {
      jasmineReportData.push(reports[i].junitReportResult)
    }
  }

  ee.on('end', function() {
    if(options.callback && ++reportsCount == reports.length)
      options.callback()
  })

  istanbul.writeReport(options.istanbul.report, istanbulReportData,
    options.istanbul.reporters, ee)

  jasmine.writeReport(options.jasmine.report, jasmineReportData,
    options.jasmine.reporters, ee)
}

module.exports = init
