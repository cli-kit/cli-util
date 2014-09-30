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
  it('should error on cyclical reference', function(done) {
    var a = {};
    var b = {a: a};
    a.b = b;
    function fn() {
      walk(b, function(props){return true}, function(props){});
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
  it('should walk array', function(done) {
    var obj = ['a', 'b', 'c'];
    walk(obj, function visit(props) {
      return true;
    }, function transform(props) {
      expect(props.parent).to.be.an('array');
      expect(props.name).to.be.a('string');
      expect(props.value).to.be.a('string');
    });
    done();
  });
  it('should walk mixed', function(done) {
    var obj = {a: new String('d'), b: new String('e'), c: [3, 4 ,5]};
    walk(obj, function visit(props) {
      return (props.value instanceof String);
    }, function transform(props) {
      expect(props.name).to.be.a('string');
      expect(props.value).to.be.a('string');
      props.value.visited = true;
    });

    expect(obj.a.visited).to.eql(true);
    expect(obj.b.visited).to.eql(true);
    expect(obj.c.visited).to.eql(undefined);
    done();
  });
})
