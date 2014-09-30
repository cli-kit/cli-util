var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should repeat space twice', function(done) {
    var res = util.repeat();
    expect(res).to.eql('  ');
    done();
  });
  it('should repeat space x4', function(done) {
    var res = util.repeat(4);
    expect(res).to.eql('    ');
    done();
  });
  it('should repeat char x4', function(done) {
    var res = util.repeat(4, 'x');
    expect(res).to.eql('xxxx');
    done();
  });
  it('should repeat char x0', function(done) {
    var res = util.repeat(0);
    expect(res).to.eql('');
    done();
  });
  it('should repeat char -4', function(done) {
    var res = util.repeat(-4, 'x');
    expect(res).to.eql('xxxx');
    done();
  });
})
