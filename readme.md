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

jip([options]);
```

### Example
See example project using Gulp to run only changed specs at
[/example](https://github.com/fermads/jasmine-istanbul-phantom/tree/master/example)

Run the example:
```
cd jasmine-istanbul-phantom/example
gulp test watch
```

### Options
`[options]` is an object with the following properties and default values:

- **base** (_path_): Defaults try to find `./test` or `./tests` directory<br>
  It's the base path for test files. Will be the parent directory of
  `tmp`, `fixture` and `report` dirs

- **src** (_glob_): defaults to `src/**/*.js`<br>
  JavaScript source files. The ones that will be instrumented and tested

- **lib** (_glob_): defaults to `['lib/**/*.js', 'vendor?(s)/**/*.js']`<br>
  Other JavaScript files. Will not be tested nor instrumented. Usually this
  property should be overwridden to ensure libs loading order

- **tmp** (_path_): defaults to `[base]/tmp`<br>
  Path to write instrumented source code, fixtures file and
  final generated spec runner

- **spec** (_glob_): defaults to `[base]/spec?(s)/**/*.js`<br>
  Jasmine spec files. The ones that will test the src files

- **runner** (_file_): defaults to
  `jasmine-istanbul-phantom/lib/jasmine/SpecRunner.html`<br>
  Jasmine spec runner template. Will be used to generate the final HTML spec
  runner with calls to src, lib and spec files

- **fixture** (_glob_): defaults to `[base]/fixture/*`<br>
  Files to be available as fixtures inside spec files.
  Access fixtures with `getFixture([filename])`

- **callback** (_function_): defaults to `null`<br>
  Callback function is called when all tests end

- **jasmine**
  - **report** (_path_): default to `[base]/report/unit`<br>
    Path to write Jasmine JUnit XML reports

- **istanbul**
  - **report** (_path_):  default to `[base]/report/coverage`<br>
    Path to write Istanbul file reports

  - **reporters** (_array_): defaults to `['text-summary', 'lcov', 'clover']`<br>
    List of Istanbul reporters

- **phantom**
  - **bin** (_file_): Defaults try to find Phantomjs using
    [which](https://www.npmjs.com/package/npm-which)<br>
    Phantomjs binary file location

  - **verbose** (_boolean_): defaults to `false`<br>
    Show resource errors e.g. file not found

  - **params** (_map_): defaults to `{}`<br>
    Phantomjs additional runtime parameters. See some
    [useful parameters](https://github.com/fermads/jasmine-istanbul-phantom#useful-phantomjs-parameters)


### Using fixtures
All files from the fixtures glob are loaded and made available as an object to
the spec files. Properties are filenames and values are strings. See
[FixtureSpec example](https://github.com/fermads/jasmine-istanbul-phantom/blob/master/example/test/spec/FixtureSpec.js)

```js
// on any spec file, get the song.json fixture as a JSON
var song = JSON.parse(getFixture('song.json'))
```

```js
// show object with all fixtures
console.log(getFixture());
```

### Run Jasmine tests in a browser
After running some tests, open the generated spec runner
`[base]/[tmp]/SpecRunner.html` in a browser with GUI (not Phantom).
It is useful for test development and debug of Jasmine specs

### Istanbul coverage reports
Console shows only a summary report. Open
`[base]/[report]/coverage/lcov-report/index.html` in a browser for
full coverage report

## Editing the spec runner
Copy the original spec runner's template from
`jasmine-istanbul-phantom/lib/jasmine/SpecRunner.html`
to another path and run with option `{runner:'path/to/new/runner.html'}`.
Edit the new runner as needed but keep the Jasmine and fixture script/style
includes

### Jasmine ajax tests
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
jip({
  phantom: {
    bin : '/path/to/phantom2',
  }
})
```

### Useful Phantomjs parameters
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
