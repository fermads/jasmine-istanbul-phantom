(function(global) {
  var exportObject;
  if (typeof module !== 'undefined' && module.exports) {
    exportObject = exports;
  } else {
    exportObject = global.jasmineReporters = global.jasmineReporters || {};
  }

  exportObject.IstanbulReporter = function(options) {
    var self = this;
    self.jasmineDone = function() {
      var report = {
        istanbulReportResult: global[options.coverageVar] // this is a global variable created by istanbul instrumented source code to store coverage report
      };

      global[options.reportsVar].push(report);
    }
  }
})(this);

/*document.addEventListener('load', function() {
  var sel = document.querySelectorAll('div.jasmine_html-reporter');
  if(!sel || !sel[0])
    return;
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.top = '20px';
  div.style.left = '200px';
  div.style.height = '40px';
  div.style.width = '200px';
  var text = document.createTextNode('Istanbul coverage reports');
  div.appendChild(text);
  sel[0].appendChild(div);
}, false);*/