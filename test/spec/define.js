var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should define property', function(done) {
    var o = {};
    util.define(o, 'field', 'value');
    // property not enumerable
    expect(Object.keys(o)).to.eql([]);
    expect(o.field).to.eql('value');
    // cannot overwrite
    o.field = 'new value';
    expect(o.field).to.eql('value');
    done();
  });

  it('should define writable property', function(done) {
    var o = {};
    util.define(o, 'field', 'value', true);
    // property not enumerable
    expect(Object.keys(o)).to.eql([]);
    expect(o.field).to.eql('value');
    o.field = 'new value';
    expect(o.field).to.eql('new value');
    done();
  });

  it('should define writable and enumerable property', function(done) {
    var o = {};
    util.define(o, 'field', 'value', true, true);
    // property not enumerable
    expect(Object.keys(o)).to.eql(['field']);
    expect(o.field).to.eql('value');
    o.field = 'new value';
    expect(o.field).to.eql('new value');
    done();
  });
});
