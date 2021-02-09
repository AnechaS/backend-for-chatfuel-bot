const isImageUrl = require('../../app/utils/isImageUrl');

describe('isImageUrl', () => {
  test('should return true', () => {
    const urlHTTPS = 'https://scontent.xx.fbcdn/v/t1.15752-9/cat.jpg';
    expect(isImageUrl(urlHTTPS)).toBe(true);

    const urlHTTP = 'http://scontent.xx.fbcdn/v/t1.15752-9/cat.jpg?abcd=1234';
    expect(isImageUrl(urlHTTP)).toBe(true);
  });

  test('should return false when parameter is empty', () => {
    expect(isImageUrl()).toBe(false);
  });
});
