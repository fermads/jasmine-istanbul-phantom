  /*
  To make all jasmine plugins work without a webserver, all of them
  must write output to the console. The output goes to Phantomjs and them
  to Node
  */
  var _allReportsOutput = [];

  var junitReporter = new jasmineReporters.JUnitXmlReporter({
      savePath: '.',
      consolidateAll: true
  });

  // overwrite junitReporter writeFile function
  // to add results to _allReportsOutput
  junitReporter.writeFile = function(filename, text) {
    var report = {
      junitReportResult: {
        filename: filename,
        text: text
      }
    };
    _allReportsOutput.push(report);
  };

  // add junit xml reports
  jasmine.getEnv().addReporter(junitReporter);

  // add console/terminal reporter
  jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({
    verbosity: 3,
    color: true,
    showStack: false
  }));

  // add istanbul reporter
  jasmine.getEnv().addReporter(new jasmineReporters.IstanbulReporter({
    reportsVar: '_allReportsOutput',
    coverageVar: '__coverage__'
  }));

  // add phantomjs reporter. This reporter sums up all other reports and send
  // them to phantom
  jasmine.getEnv().addReporter(new jasmineReporters.PhantomReporter({
    reportsVar: '_allReportsOutput'
  }));