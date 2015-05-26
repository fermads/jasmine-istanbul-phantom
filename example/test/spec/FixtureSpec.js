describe('Fixture', function() {

  it('Should get all fixtures as object/map', function() {
    // all fixters are stored in a json
    var fixtures = getFixture();

    expect(typeof fixtures).toEqual('object');
    expect(Object.keys(fixtures).length).toEqual(2)
  });

  it('Should get song fixture and extract title as JSON', function() {
    // specific fixtures are strings and must be
    // parsed if they were jsons originally
    var song = JSON.parse(getFixture('song.json'));
    expect(song.title).toEqual('Song Title');
  });

  it('Should get artist fixture and extract name as JSON', function() {
    var song = JSON.parse(getFixture('artist.json'));
    expect(song.name).toEqual('Artist name');
  });

});
