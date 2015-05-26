describe('Async', function() {
  var value;
  beforeEach(function(done) {
    setTimeout(function() {
      value = 0;
      done();
    }, 1);
  });

  it('should support async execution of test preparation and expectations',
      function(done) {
    value++;
    expect(value).toBeGreaterThan(0);
    done();
  });

  describe('asynchronous specs', function() {
    var originalTimeout;
    var called = false;

    beforeEach(function(done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;

      setTimeout(function() {
        called = true;
        done();
      }, 100);

    });

    it('takes a little time to complete', function() {
      expect(called).toBe(true)
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
  });
});