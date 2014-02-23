var expect = require('chai').expect;
var util = require('../..');
var ucfirst = util.ucfirst;

describe('cli-util:', function() {
  it('should ignore invalid parameter (ucfirst)', function(done) {
    expect(ucfirst(null)).to.eql(null);
    done();
  });
  it('should title case string (ucfirst)', function(done) {
    expect(ucfirst('string')).to.eql('String');
    done();
  });
});
