var expect = require('chai').expect;
var merge = require('../..').merge;

describe('cli-util:', function() {

  it('should copy objects (copy option)', function(done) {
    var source = {deep: {field: 'value'}};
    var target = {};
    merge(source, target, {copy: true});
    expect(target.deep === source.deep).to.eql(false);
    done();
  });

  it('should ignore merge on non-complex (source)', function(done) {
    var source = false;
    var target = {};
    merge(source, target);
    expect(target).to.eql({});
    done();
  });
  it('should ignore merge on non-complex (target)', function(done) {
    var source = {};
    var target = null;
    merge(source, target);
    expect(target).to.eql(null);
    done();
  });
  it('should use existing array reference', function(done) {
    var arr = [];
    var source = {prop: [1,2,3]};
    var target = {prop: arr};
    merge(source, target);
    expect(target.prop).to.eql(source.prop);
    expect(target.prop).to.equal(arr);
    done();
  });
  it('should use existing object reference', function(done) {
    var obj = {a: 'a', b: 'b'};
    var source = {prop: {a: 'a', b: 'b', c: 'c'}};
    var target = {prop: obj};
    merge(source, target);
    expect(target.prop).to.eql(source.prop);
    expect(target.prop).to.equal(obj);
    done();
  });
  it('should merge object into array', function(done) {
    var source = {str: 'string', num: 10};
    var target = [];
    merge(source, target);
    expect(target.str).to.eql('string');
    expect(target.num).to.eql(10);
    expect(source.__visited).to.eql(undefined);
    expect(target.__visited).to.eql(undefined);
    done();
  });
  it('should merge array into object', function(done) {
    var source = [1, 2];
    var target = {0: 3, 1: 4};
    merge(source, target);
    expect(target[0]).to.eql(1);
    expect(target[1]).to.eql(2);
    done();
  });
  it('should merge nested array', function(done) {
    var source = {arr: [1,2,3]};
    var target = {};
    merge(source, target);
    expect(target.arr).to.eql(source.arr);
    expect(source.arr.__visited).to.eql(undefined);
    expect(target.arr.__visited).to.eql(undefined);
    done();
  });
  it('should invoke clone', function(done) {
    var o = {name: 'name', description: 'description'};
    o.clone = function() {
      return {name: '' + this.name, description: '' + this.description};
    };
    var source = {o: o};
    var target = {};
    merge(source, target);
    expect(target.o).to.be.an('object');
    expect(target.o.name).to.eql('name');
    expect(target.o.description).to.eql('description');
    done();
  });
  it('should leave unknown property intact', function(done) {
    var source = {bin: './bin'};
    var target = {exit: true};
    merge(source, target);
    expect(target.exit).to.eql(true);
    expect(target.bin).to.eql('./bin');
    done();
  });
  it('should merge deep objects (recurse)', function(done) {
    var source = {
      conf: {
        bin: './bin',
        files: ['file.txt', 'file.json'],
        bool: true,
        int: 10,
        float: 3.14,
        undef: undefined,
        arr: [],
        obj: {name: 'obj', arr: [1,2,3]}
      }
    };
    var target = {exit: true, conf: {}};
    merge(source, target);
    expect(target.exit).to.eql(true);
    expect(target.conf).to.eql(source.conf);
    done();
  });
  it('should throw error on cyclical reference', function(done) {
    var f = function(){};
    var c = new f();
    c.a = new f();
    c.a.b = c.a;
    var source = {cycle: c};
    function fn() {
      merge(source, {});
    }
    //fn();
    expect(fn).throws(Error);
    expect(fn).throws(/Cyclical reference/);
    done();
  });

});
