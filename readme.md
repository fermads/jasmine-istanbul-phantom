# jasmine-istanbul-phantom

Client side JavaScript unit tests and code coverage with fixtures and
ajax mock support combining Jasmine, Istanbul and Phantom in one simple
module

- Jasmine v2.3.4 for unit tests and Istanbul for test coverage
- Tests run on Phantom 1.9.8 (included) or 2.0.0
- Fixtures auto-load
- Easy Gulp integration
- Includes Jasmine ajax mock
- Istanbul outputs summary to console and full reports to file
- Jasmine reports to console and to JUnit XML file for CI
- Spec runner can also run in a full browser
- Polyfill Function.bind for Phantom 1.9

With focus on performance, everything runs on file://. No server start/stop
and no net socket communication between Jasmine, Phantom or Node. It uses stdio.

## Install

    npm install --save-dev jasmine-istanbul-phantom

## Usage

```js
var jip = require('jasmine-istanbul-phantom');

jip([options]);
```

## Example:
```js
jip({
  src: 'src/**/*.js',
  lib: ['lib/jquery/*.min.js', 'lib/**/*.js'],
  spec: 'test/spec/*.js',
  fixture: 'test/fixture/*'
})
```
See [example project](https://github.com/fermads/jasmine-istanbul-phantom/tree/master/example)

#### Gulp example
See a [gulpfile.js](https://github.com/fermads/jasmine-istanbul-phantom/blob/master/example/gulpfile.js)
that runs only changed specs

## Options
`[options]` is an object with the following properties and default values:

- **base** (_path_): Defaults try to find `./test` or `./tests` directory<br>
  It's the base path for test files. Will be the parent directory of `spec`,
  `tmp`, `fixture` and `report` folders when using defaults. Otherwise one must
  set all paths individually.
- **src** (_glob_): defaults to `['src/**/*.js','app/**/*.js']`<br>
  JavaScript source files. The ones that will be instrumented and tested
- **lib** (_glob_): defaults to `['lib/**/*.js', 'vendor?(s)/**/*.js']`<br>
  Other JavaScript files. Will not be tested nor instrumented. Usually this
  property should be overridden to ensure libs loading order
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
  - **bin** (_file_): Default uses the included
    [npm phantom](https://www.npmjs.com/package/phantomjs)<br>
    Phantom binary file location
  - **verbose** (_boolean_): defaults to `false`<br>
    Show resource errors e.g. file not found
  - **params** (_object_): defaults to `{}`<br>
    Phantom additional runtime parameters. See some
    [useful parameters](#useful-phantom-parameters)


#### Example project structure
Works with this module's default options
```
project/
├── lib/
│   ├── jquery
│   │   └── jquery-2.1.4.min.js
│   └── etc...
├── src/ (required)
│   ├── app.js
│   ├── util.js
│   └── etc...
└── test/ (required)
    ├── fixture/ (optional)
    │   └── all fixture files...
    ├── report/ (auto-created)
    │   ├── coverage
    │   │   └── Istanbul reports...
    │   └── unit
    │       └── Jasmine reports...
    ├── spec/ (required)
    │   └── all spec files...
    └── tmp/ (auto-created)
        ├── isrc/
        │   └── generated instrumented src
        └── SpecRunner.html (generated spec runner)
```

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

### Editing the spec runner
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

### Phantom 2.0
This module comes with [npm phantom](https://www.npmjs.com/package/phantomjs)
v1.9.8 (as of may 2015). To run with Phantom 2.x, install it and use the option
below.
```js
jip({
  phantom: {
    bin : '/path/to/phantom2',
  }
})
```

### Useful Phantom parameters
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
- make writeFixtures and writeRunner async
- istanbul thresholds support
- **clear** (_boolean_): Remove all tmp files at the end (instrumented
  code, generated spec runner, etc). Defaults to false
- run ajaxInstall on init?
- option to run with webserver instead of file://
- add option for Phantom's viewportSize
- show istanbul results inside of jasmine spec runner (browser); or a link
-->
