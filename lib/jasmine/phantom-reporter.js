(function(global) {
  var exportObject;

  if (typeof module !== 'undefined' && module.exports) {
    exportObject = exports;
  } else {
    exportObject = global.jasmineReporters = global.jasmineReporters || {};
  }

  exportObject.PhantomReporter = function(options) {
    var self = this;
    self.jasmineDone = function() {

      // console.log messages goes from phantom to node.js using stdio.
      // They do not arrive the same as sent. 1 long console.log arrives
      // at node.js in many pieces. JSONSTART and JSONEND mark the
      // message so node.js can append it until it ends
      console.log('#JSONSTART#');
      console.log(JSON.stringify(global[options.reportsVar]));
      console.log('#JSONEND#');
    }
  }
})(this);