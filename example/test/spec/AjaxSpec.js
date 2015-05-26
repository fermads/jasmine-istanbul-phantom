describe('Ajax', function() {
  var ajax;

  beforeAll(function() {
    jasmine.Ajax.install();
  });

  beforeEach(function() {
    ajax = new Ajax();
  })

  afterAll(function() {
    // no need to uninstall ajax mock since fixtures do not use XHR
    // jasmine.Ajax.uninstall();
  });

 it('Basic XHR request should work with Jasmine Mock Ajax', function() {
      var doneFn = jasmine.createSpy('success');

      // calling application (Ajax.js) from src/
      ajax.basicXhrRequest(doneFn);

      expect(jasmine.Ajax.requests.mostRecent().url).toBe('/content.json');
      expect(doneFn).not.toHaveBeenCalled();

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': 200,
        'contentType': 'text/plain',
        'responseText': 'awesome response'
      });

      expect(doneFn).toHaveBeenCalledWith('awesome response');
    });

  it('jQuery Ajax request should work with Jasmine Mock Ajax', function() {
    var doneFn = jasmine.createSpy('success');

    ajax.jQueryRequest(doneFn);

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/song.json');

    jasmine.Ajax.requests.filter(/song.json/)[0].respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify({'test':true})
    });

    expect(doneFn).toHaveBeenCalledWith({'test':true});
  })
})