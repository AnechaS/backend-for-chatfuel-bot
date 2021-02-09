/* eslint-disable no-console, prefer-template */

const Transport = require('winston-transport');

class TestTransport extends Transport {
  log(info, callback) {
    callback(null, true);
  }
}

describe('logger', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should add transport', () => {
    jest.mock('config', () => {
      return {
        get: () => ({ jsonLogs: true }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');
    const testTransport = new TestTransport();
    const spy = jest.spyOn(testTransport, 'log');
    logger.add(testTransport);
    expect(logger.transports.length).toBe(4);
    logger.info('hi');
    expect(testTransport.log).toHaveBeenCalled();
    logger.error('error');
    expect(testTransport.log).toHaveBeenCalled();
    logger.remove(testTransport);
    expect(logger.transports.length).toBe(3);

    spy.mockRestore();
  });

  it('should have files transports', () => {
    jest.mock('config', () => {
      return {
        get: () => ({ jsonLogs: true }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');

    const transports = logger.transports;
    expect(transports.length).toBe(3);
  });

  it('should disable files logs', () => {
    jest.mock('config', () => {
      return {
        get: () => ({ logsFolder: null, jsonLogs: true }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');

    const transports = logger.transports;
    expect(transports.length).toBe(1);
  });

  test('should have a timestamp', done => {
    jest.mock('config', () => {
      return {
        get: () => ({ jsonLogs: true }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');
    logger.info('hi');
    logger.query({ limit: 1 }, (err, results) => {
      if (err) {
        done.fail(err);
      }

      expect(results['server'][0].timestamp).toBeDefined();
      done();
    });
  });

  /**
   * TODO testing logger return
   * @see https://stackoverflow.com/questions/57771616/how-to-use-jest-to-mock-winston-logger-instance-encapsulated-in-service-class
   * @see https://github.com/facebook/jest/issues/8902
   * @see https://github.com/winstonjs/winston#awaiting-logs-to-be-written-in-winston
   * @see https://github.com/winstonjs/winston/issues/1544
   */
  test('console should not be json', () => {
    jest.mock('config', () => {
      return {
        get: () => ({
          logsFolder: null,
          silent: false
        }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');

    const spy = jest.spyOn(console._stdout, 'write').mockImplementation();

    logger.info('hi', { key: 'value' });

    expect(spy).toHaveBeenCalled();
    const log = spy.mock.calls[0][0];
    expect(log).toBe('info: hi {"key":"value"}' + '\n');
    spy.mockRestore();
  });

  test('should enable JSON logs ', () => {
    jest.mock('config', () => {
      return {
        get: () => ({
          logsFolder: null,
          jsonLogs: true,
          silent: false
        }),
        has: () => {}
      };
    });

    const logger = require('../../app/utils/logger');

    const spy = jest.spyOn(console._stdout, 'write').mockImplementation();
    logger.info('hi', { key: 'value' });
    expect(spy).toHaveBeenCalled();
    const log = spy.mock.calls[0][0];
    expect(log).toBe(
      JSON.stringify({ key: 'value', level: 'info', message: 'hi' }) + '\n'
    );

    spy.mockRestore();
  });
});
