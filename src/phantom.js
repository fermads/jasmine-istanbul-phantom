var cp = require('child_process')

var partialReport = ''
var isPartial = false
var endCallback

function run(options, callback) {
  var args = []
  endCallback = callback

  for(var param in options.params) {
    args.push('--' + param + '=' + options.params[param])
  }

  args = args.concat([options.api, options.runner, options.verbose])

  var phantom = cp.spawn(options.bin, args)

  var exit = function(error) {
    try {
      phantom.kill()
    }
    catch(e) {
      console.error(e)
    }

    if(error && error.stack) {
      console.error('Phantom exited unexpectedly', error.stack)
      process.exit(1)
    }
    else {
      process.exit(0)
    }
  }

  process.on('SIGINT', exit)
  process.on('SIGTERM', exit)
  process.on('uncaughtException', exit)
  phantom.once('error', exit)

  phantom.once('exit', function (code) {
    if(code !== 0)
      console.error('Phantom exited with code', code)
  })

  phantom.stderr.on('data', function (data) {
    console.error('Phantom stderr:', data)
  })

  phantom.stdout.on('data', function (data) {
    parse(data.toString())
  })
}

function end() {
  var parts = partialReport.split(/#JSONSTART#|#JSONEND#/)
  var reports = JSON.parse(parts[1])

  isPartial = false
  process.stdout.write(parts[0] + parts[2])
  endCallback(reports)
}

function parse(msg) {
  if(msg.indexOf('#JSONSTART#') != -1) { // json report started
    isPartial = true
    partialReport += msg
    if(msg.indexOf('#JSONEND#') != -1) {
      // json started and ended at the same msg
      end()
    }
  }
  else if(msg.indexOf('#JSONEND#') != -1) {
    // json ended
    partialReport += msg
    end()
  }
  else if(isPartial) {
    // store partial json
    partialReport += msg
  }
  else {
    // output to console while tests are running
   process.stdout.write(msg)
  }
}

module.exports = {
  run: run,
  parse: parse
}