var expect = require('chai').expect;
var util = require('../..');

describe('cli-util:', function() {
  it('should ignore non-string', function(done) {
    var res = util.wrap(null, 0, 80);
    expect(res).to.eql(null);
    done();
  });
  it('should throw type error on invalid column', function(done) {
    var str = 'I have a dream';
    function fn() {
      util.wrap(str, NaN);
    }
    expect(fn).throws(TypeError);
    done();
  });
  it('should throw type error on invalid amount', function(done) {
    var str = 'I have a dream';
    function fn() {
      util.wrap(str, 0, 'value');
    }
    expect(fn).throws(TypeError);
    done();
  });
  it('should leave short string untouched', function(done) {
    var str = 'I have a dream';
    var res = util.wrap(str, 0, 80);
    var expected = 'I have a dream';
    expect(res).to.eql(expected);
    done();
  });
  it('should use default amount', function(done) {
    var str = 'I have a dream';
    var res = util.wrap(str, 0, 0);
    var expected = 'I have a dream';
    expect(res).to.eql(expected);
    done();
  });
  it('should indent single line (first)', function(done) {
    var str = 'I have a dream';
    var padding = util.repeat(20);
    var res = util.wrap(str, 20, 80, true);
    var expected = padding + 'I have a dream';
    expect(res).to.eql(expected);
    done();
  });
  it('should wrap with length 1 (prevent infinite loop)', function(done) {
    var str = 'I have a dream';
    var res = util.wrap(str, 0, 1);
    var expected = 'h-\na-\nve\nd-\nr-\ne-\nam';
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
  it('should word wrap word that equals target length', function(done) {
    var str = util.repeat(80, 'x');
    var res = util.wrap(str, 0, 80);
    expect(res).to.eql(str);
    done();
  });
  it('should word wrap word that exceeds target length', function(done) {
    var str = util.repeat(120, 'x');
    var expected = util.repeat(79, 'x') + '-' + '\n' + util.repeat(41, 'x')
    var res = util.wrap(str, 0, 80);
    expect(res).to.eql(expected);
    done();
  });
  it('should word wrap multiple words that equals target length',
    function(done) {
      var x = util.repeat(80, 'x');
      var expected = [x,x,x].join('\n');
      var str = [x,x,x].join(' ');
      var res = util.wrap(str, 0, 80);
      expect(res).to.eql(expected);
      done();
    }
  );
  it('should respect hard line breaks', function(done) {
    var str = 'I have a dream.\n\nThat one day this nation will rise up and ';
    str += 'live out the true meaning of its creed: "We hold these truths '
    str += 'to be self-evident, that all men are created equal."';
    var res = util.wrap(str, 0, 80);
    var expected = 'I have a dream.\n\nThat one day this nation will rise up ';
    expected += 'and live out the true meaning of its\ncreed: "We hold these ';
    expected += 'truths to be self-evident, that all men are created\nequal."';
    expect(res).to.eql(expected);
    done();
  });

  it('should respect indent with hard line breaks', function(done) {
    var str = 'I have a dream.\n\nThat one day this nation will rise up and ';
    str += 'live out the true meaning of its creed: "We hold these truths '
    str += 'to be self-evident, that all men are created equal."';
    var res = util.wrap(str, 20, 80);
    var expected = 'I have a dream.\n\n                    That one day this ';
    expected += 'nation will rise up and live out the true\n';
    expected += '                    meaning of its creed: "We hold these '
    expected += 'truths to be\n                    self-evident, that all ';
    expected += 'men are created equal."';
    expect(res).to.eql(expected);
    done();
  });
  it('should indent first with hard line breaks', function(done) {
    var str = 'I have a dream.\n\nThat one day this nation will rise up and ';
    str += 'live out the true meaning of its creed: "We hold these truths '
    str += 'to be self-evident, that all men are created equal."';
    var res = util.wrap(str, 20, 80, true);
    var expected = '                    I have a dream.\n\n                    ';
    expected += 'That one day this nation will rise up and live out the true\n';
    expected += '                    meaning of its creed: "We hold these ';
    expected += 'truths to be\n                    self-evident, that all men ';
    expected += 'are created equal."';
    expect(res).to.eql(expected);
    done();
  });
  it('should not enter infinite loop on amount less than column',
    function(done) {
    var str = util.repeat(120, 'x');
    var res = util.wrap(str, 20, -12, false);
    // funky output here
    //console.dir(res);
    done();
    }
  );
})
