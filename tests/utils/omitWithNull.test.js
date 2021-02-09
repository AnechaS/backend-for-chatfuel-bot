const omitWithNull = require('../../app/utils/omitWithNull');

describe('Util omitWithNull', () => {
  it('should transition object', () => {
    const o = { 
      a: undefined, 
      b: 2, 
      c: 4, 
      d: NaN,
      e: null, 
      f: false, 
      g: '', 
      h: 0,
      i: 'null'
    };
    expect(omitWithNull(o)).toEqual({
      b: 2,
      c: 4,
      f: false,
      h: 0,
    });
  
    const o2 = { 
      people: '1601b96497',
      question: 'abc',
      answer: 0,
      botId: 'a',
      blockId: 'aa',
    };
    
    expect(omitWithNull(o2)).toEqual({
      people: '1601b96497',
      question: 'abc',
      answer: 0,
      botId: 'a',
      blockId: 'aa',
    });
  });
  
  it('should transition object multiple', () => {
    const o1 = { 
      a: undefined, 
      b: 2, 
      c: 4, 
      d: NaN,
      e: null, 
      f: false, 
      g: '', 
      h: 0,
      i: 'null',
      j: {
        a: undefined, 
        b: 2, 
        c: 4, 
        d: NaN,
        e: null, 
        f: false, 
        g: '', 
        h: 0,
        i: 'null',
      }
    };
    expect(omitWithNull(o1)).toEqual({
      b: 2,
      c: 4,
      f: false,
      h: 0,
      j: {
        b: 2,
        c: 4,
        f: false,
        h: 0,
      }
    });
  
    const o2 = { 
      a: undefined, 
      b: 2, 
      c: 4, 
      d: NaN,
      e: null, 
      f: false, 
      g: '', 
      h: 0,
      i: 'null',
      j: {
        a: undefined, 
        b: 2, 
        c: 4, 
        d: NaN,
        e: null, 
        f: false, 
        g: '', 
        h: 0,
        i: 'null',
        j: {
          a: undefined, 
          b: 2, 
          c: 4, 
          d: NaN,
          e: null, 
          f: false, 
          g: '', 
          h: 0,
          i: 'null',
        }
      }
    };
    expect(omitWithNull(o2)).toEqual({
      b: 2,
      c: 4,
      f: false,
      h: 0,
      j: {
        b: 2,
        c: 4,
        f: false,
        h: 0,
        j: {
          b: 2,
          c: 4,
          f: false,
          h: 0,
        }
      }
    });
  });
});