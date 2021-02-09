const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const cloudinary = require('../../app/utils/cloudinary');

jest.mock('node-fetch');

describe('cloudinary', () => {
  test('should upload image to cloudinary', async () => {
    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            asset_id: 'd028e60447be58a86aae0fb025179010',
            public_id: 'cat',
            version: 1590419344,
            version_id: 'd493d21c1c4bb627ebc46a6c5e48e1d3',
            signature: '30ba44301ab9b55e2498091708d4dc3f17dc06e5',
            width: 1000,
            height: 558,
            format: 'jpg',
            resource_type: 'image',
            created_at: '2020-05-25T15:09:04Z',
            tags: [],
            bytes: 72516,
            type: 'upload',
            etag: 'ad2edb4ec9f4526f05d138b87e02a076',
            placeholder: false,
            url:
              'http://res.cloudinary.com/simple/image/upload/v1590419344/cat.jpg',
            secure_url:
              'https://res.cloudinary.com/simple/image/upload/v1590419344/cat.jpg',
            original_filename: 'cat'
          })
        )
      )
    );
    /* const upload =  await  */ cloudinary.upload('http://example.com/image/cat.jpg');
    expect(fetch).toHaveBeenCalled();
  });

  test('should get image transform', async () => {
    expect(cloudinary.image('cat.jpg', 'good man')).toBeDefined();
  });
});
