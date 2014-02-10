var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should leave short string untouched', function(done) {
    var str = 'I have a dream';
    var res = util.wrap(str, 0, 80);
    var expected = 'I have a dream';
    expect(res).to.eql(expected);
    done();
  });
  it('should word wrap long string', function(done) {
    var str = 'I have a dream that one day this nation will rise up and ';
    str += 'live out the true meaning of its creed: "We hold these truths '
    str += 'to be self-evident, that all men are created equal."';
    var res = util.wrap(str, 0, 80);
    var expected = 'I have a dream that one day this nation will rise up and '
    expected += 'live out the true\nmeaning of its creed: "We hold these '
    expected += 'truths to be self-evident, that all men are\ncreated equal."';
    expect(res).to.eql(expected);
    done();
  });
  it('should word wrap long string with indent (column)', function(done) {
    var col = 8;
    var pad = util.repeat(col);
    var str = 'I have a dream that one day this nation will rise up and ';
    str += 'live out the true meaning of its creed: "We hold these truths '
    str += 'to be self-evident, that all men are created equal."';
    var res = util.wrap(str, col, 80);
    var expected = 'I have a dream that one day this nation will rise up and '
    expected += 'live out the\n'
      + pad + 'true meaning of its creed: "We hold these '
    expected += 'truths to be self-evident,\n'
      + pad + 'that all men are created equal."';
    expect(res).to.eql(expected);
    done();
  });
})
