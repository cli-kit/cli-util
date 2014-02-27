var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should trim leading whitespace', function(done) {
    expect(util.ltrim(' xxx')).to.eql('xxx');
    done();
  });
  it('should return invalid value (ltrim)', function(done) {
    expect(util.ltrim(undefined)).to.eql(undefined);
    done();
  });
  it('should trim trailing whitespace', function(done) {
    expect(util.rtrim('xxx ')).to.eql('xxx');
    done();
  });
  it('should return invalid value (rtrim)', function(done) {
    expect(util.rtrim(undefined)).to.eql(undefined);
    done();
  });
});
