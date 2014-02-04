var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should return source untouched', function(done) {
    var str = 'name';
    var res = util.delimited(str);
    expect(res).to.eql('name');
    done();
  });
  it('should return delimited', function(done) {
    var str = 'fileName';
    var res = util.delimited(str);
    expect(res).to.eql('file-Name');
    done();
  });
  it('should return lowercase delimited', function(done) {
    var str = 'fileName';
    var res = util.delimited(str, null, true);
    expect(res).to.eql('file-name');
    done();
  });
  it('should use delimiter (_)', function(done) {
    var str = 'fileName';
    var res = util.delimited(str, '_', true);
    expect(res).to.eql('file_name');
    done();
  });
});
