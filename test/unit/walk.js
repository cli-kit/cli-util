var expect = require('chai').expect;
var util = require('../..');
var walk = util.walk;

describe('cli-util:', function() {
  it('should error on invalid root', function(done) {
    function fn() {
      walk(1);
    }
    expect(fn).throws(Error);
    done();
  });
  it('should error on invalid visit', function(done) {
    function fn() {
      walk({}, {});
    }
    expect(fn).throws(Error);
    done();
  });
  it('should error on invalid transform', function(done) {
    function fn() {
      walk({}, function(props){}, {});
    }
    expect(fn).throws(Error);
    done();
  });
  it('should walk object', function(done) {
    var obj = {a: 1, b: 2, c: 3};
    walk(obj, function visit(props) {
      return true;
    }, function transform(props) {
      expect(props.parent).to.be.an('object');
      expect(props.name).to.be.a('string');
      expect(props.value).to.be.a('number');
    });
    done();
  });
})
