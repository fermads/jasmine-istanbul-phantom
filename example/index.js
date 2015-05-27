var jip = require('../src')

jip({
  src: 'src/**/*.js',
  lib: ['lib/jquery/*.min.js', 'lib/**/*.js'],
  spec: 'test/spec/*.js',
  fixture: 'test/fixture/*',
  phantom: {
    params: {
      'load-images': false
    }
  }
})