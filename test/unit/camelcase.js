var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should return source untouched', function(done) {
    var str = 'name';
    var res = util.camelcase(str);
    expect(res).to.eql('name');
    done();
  });
  it('should return camelcase', function(done) {
    var str = 'file-name';
    var res = util.camelcase(str);
    expect(res).to.eql('fileName');
    done();
  });
  it('should return camelcase with leading delimiter', function(done) {
    var str = '--file-name';
    var res = util.camelcase(str);
    expect(res).to.eql('fileName');
    done();
  });
})
