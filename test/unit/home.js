var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should return filesystem path', function(done) {
    expect(util.home()).to.be.a('string');
    done();
  });
})
