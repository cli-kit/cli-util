var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should make array unique', function(done) {
    var res = util.uniq(['a', 'a', 'a', 'b', 'b', 'c']);
    expect(res).to.eql(['a', 'b', 'c']);
    done();
  });
})
