# jasmine-istanbul-phantom

Client side JavaScript unit tests and code coverage with fixtures and
ajax mock support

- Jasmine 2.3.4 unit tests
- Istanbul test coverage
- Tests run on Phantomjs 1.9 (included) or 2.0
- Fixtures auto-load
- Includes Jasmine ajax mock
- Istanbul outputs summary to console and full reports to file
- Jasmine reports to console and to JUnit XML file for CI
- Spec runner can also run in a full browser
- Polyfill Function.bind for Phantom 1.9


<!--
Focused on performance, everything runs on file://. No server start/stop and
no socket communication between jasmine, phantom and node.js. It uses stdio.
This is also why one must use Ajax mock and the provided getFixture()
Async file writes and reads.
-->

## Install

    npm install --save-dev jasmine-istanbul-phantom

## Usage

```js
var jip = require('jasmine-istanbul-phantom');
jip([options])
```

### Example
Exemple project using Gulp to run only changed specs
[/example](https://github.com/fermads/jasmine-istanbul-phantom/tree/master/example)

```bash
cd jasmine-istanbul-phantom/example
gulp test watch
```

### Default options
If no `options` argument is provided, will assume:

*basepath* as `./test` or `./tests`

```js
{
  src: 'src/**/*.js',
  lib: ['lib/**/*.js', 'vendor?(s)/**/*.js'],
  tmp: basepath +'/tmp',
  spec: basepath +'/spec?(s)/**/*.js',
  runner: libpath +'/jasmine/SpecRunner.html',
  fixture: basepath +'/fixture/*',
  callback: null,
  jasmine: {
    lib: libpath +'/jasmine',
    report: basepath +'/report/unit'
  },
  istanbul: {
    report: basepath +'/report/coverage',
    reporters: ['text-summary', 'lcov', 'clover']
  },
  phantom: {
    bin: '',
    verbose: false,
    params: {}
  }
}
```
Where:

- **src** (_glob_): JavaScript source files. The ones that will be instrumented
  and tested
- **lib** (_glob_): Other JavaScript files. Will not be tested nor instrumented
- **tmp** (_path_): Path to write instrumented source code, fixtures file and
  final generated spec runner
- **spec** (_glob_): Jasmine spec files. The ones that will test the src files
- **runner** (_file_): Jasmine spec runner template. Will be used to
  generate the final HTML spec runner with calls to src, lib and spec files
- **fixture** (_glob_): Files to be available as fixtures inside spec files.
  Access fixtures with `getFixture([filename])`
- **callback** (_function_): Callback is called when tests end
- **jasmine**
  - **report** (_path_): Path to write Jasmine JUnit XML reports
- **istanbul**
  - **report** (_path_): Path to write Istanbul reports
  - **reporters** (_array_): List of Istanbul reporters
- **phantom**
  - **bin** (_file_): Phantomjs binary. If not specified, try to find it
    using [which](https://www.npmjs.com/package/npm-which)
  - **verbose** (_boolean_): Show resource errors e.g. file not found
  - **params** (_array_): Phantomjs additional runtime parameters

## Using fixtures
All files from the fixtures glob are loaded and made available as an object to
the spec files. Properties are filenames and values are strings

```js
// on any spec file, get the song.json fixture as a JSON
var song = JSON.parse(getFixture('song.json'))
```

```js
// show object with all fixtures
console.log(getFixture());
```

## Run Jasmine tests in a browser
Open `[basepath]/[tmp]/[runner]` in a full browser (not Phantom).
Default is `test/tmp/SpecRunner.html`. Running in a browser will not
generate coverage and unit file reports but is useful to debug Jasmine specs

## Istanbul coverage reports
Console shows only a summary report. Open
`[basepath]/[report]/coverage/lcov-report/index.html` in a browser for
full coverage report

## Editing the spec runner
Copy the original spec runner's template from
`node_modules/jasmine-istanbul-phantom/lib/jasmine/SpecRunner.html`
to another path and run with option `{runner:'path/to/new/runner.html'}`.
Edit the new runner as needed but keep the jasmine and fixture script/style
includes

## Jasmine ajax tests
XHR tests use the included
[Jasmine Mock ajax](https://github.com/jasmine/jasmine-ajax).

Example at
[/example/test/spec/AjaxSpec.js](https://github.com/fermads/jasmine-istanbul-phantom/tree/master/example/test/spec/AjaxSpec.js)

Remember to run ```jasmine.Ajax.install()``` before any ajax request and
don't bother to turn it off. Usually it's turned on and off because fixtures are
fetched using ajax. This module preload fixtures and do not use ajax
to load them.

## Phantomjs 2.0
This module comes with [npm phantom](https://www.npmjs.com/package/phantomjs).
To run with Phantomjs 2.x, install and add it to your path or use the option
below.
```js
{
  phantom: {
    bin : '/path/to/phantom2',
  }
}
```

## Useful Phantomjs parameters
```js
jip({
  phantom: {
    params: {
      // forbids cross-domain XHR (default is true)
      'web-security': true|false
      // ignores SSL errors such as expired or self-signed (default is false)
      'ignore-ssl-errors': true|false
      // load all inlined images (default is true)
      'load-images': true|false
      // allows local content to access remote URL (default is false)
      'local-to-remote-url-access': true|false
    }
  }
})
```

<!--
## To-do
- make writeFixtures async
- istanbul thresholds support
- **clear** (_boolean_): Remove all tmp files at the end (instrumented
  code, generated spec runner, etc). Defaults to false
- run ajaxInstall on init?
- option to run with webserver instead of file://
- add option for Phantom's viewportSize
- show istanbul results inside of jasmine spec runner (browser); or a link
-->
