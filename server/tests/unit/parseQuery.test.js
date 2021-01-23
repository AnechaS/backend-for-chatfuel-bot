const createError = require('http-errors');
const httpStatus = require('http-status');
const parseQuery = require('../../utils/parseQuery');

describe('parseQuery', () => {
  it('should return object when query is empty', () => {
    expect(parseQuery({})).toEqual({});
  });

  it('ignores keys that are not whitelisted', () => {
    let query = {
      foo: 'bar',
    };

    expect(parseQuery(query)).toEqual({});
  });

  it('should return object when where key is valid json', () => {
    const query = {
      where: '{"foo":"bar"}',
    };

    expect(parseQuery(query)).toEqual({ where: { foo: 'bar' } });
  });

  it('should error when where key invalid json', () => {
    const query = {
      where: 'abc',
    };

    expect(() => parseQuery(query)).toThrow(
      '"where" must be a json'
    );
  });

  it('should return object when sort key is valid json', () => {
    let query = {
      sort: '{"foo":"bar"}',
    };

    expect(parseQuery(query)).toEqual({ sort: JSON.parse(query.sort) });
  });

  it('should return when sort key is a string', () => {
    let query = {
      sort: 'foo',
    };
    expect(parseQuery(query)).toEqual(query);
  });

  it('should return when skip key is a string', () => {
    let query = {
      skip: '1',
    };
    expect(parseQuery(query)).toEqual({ skip: 1 });
  });

  it('should return when limit key is a string', () => {
    let query = {
      limit: '1',
    };

    expect(parseQuery(query)).toEqual({ limit: 1 });
  });

  it('should return when distinct key is a string', () => {
    let query = {
      distinct: 'foo',
    };

    expect(parseQuery(query)).toEqual(query);
  });

  it('should return when populate key is a string', () => {
    let query = {
      populate: 'foo',
    };

    expect(parseQuery(query)).toEqual({
      populate: [
        {
          path: 'foo',
        },
      ],
    });
  });
});
