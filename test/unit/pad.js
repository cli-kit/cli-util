var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should pad string (trailing)', function(done) {
    var res = util.pad('a', 5);
    expect(res.length).to.eql(5);
    expect(res).to.eql('a    ');
    done();
  });
  it('should pad string (leading)', function(done) {
    var res = util.pad('a', 5, true);
    expect(res.length).to.eql(5);
    expect(res).to.eql('    a');
    done();
  });
})
