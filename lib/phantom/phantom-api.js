/*
This is not client side JS nor Node.js API. This is Phantomjs API
*/

var webpage = require('webpage')
var page = webpage.create()
var system = require('system')

var runner = 'file:///'+ system.args[1]
var verbose = system.args[2] == 'true'

/*page.viewportSize = {
  width: 480,
  height: 800
}*/

page.onResourceError = function(resource) {
  if(verbose)
    console.log(resource.errorString)
}

page.open(runner, function (status) {
  if (status !== 'success') {
    console.error('Unable to open', runner)
    phantom.exit(1)
  }
})

page.onConsoleMessage = function(msg) {
  // system.stdout.write(msg)
  console.log(msg)

  if(msg.indexOf('#JSONEND#') != -1)  {
    phantom.exit()
  }
}

