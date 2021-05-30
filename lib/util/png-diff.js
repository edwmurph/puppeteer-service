const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const {
  DIFF_THRESHOLD,
} = process.env;

const pngDiff = (img1, img2) => {
  const imgs = [
    PNG.sync.read( img1 ),
    PNG.sync.read( img2 ),
  ];

  const diffPixels = Math.abs(imgs[0].width - imgs[1].width)
    + Math.abs(imgs[0].height - imgs[1].height);

  if (diffPixels) {
    return {
      pixels: diffPixels,
      image: null,
    };
  }

  const diff = new PNG({ width: imgs[0].width, height: imgs[0].height });

  const numDiffPixels = pixelmatch(
    imgs[0].data,
    imgs[1].data,
    diff.data,
    imgs[0].width,
    imgs[0].height,
    {
      threshold: DIFF_THRESHOLD,
      includeAA: false,
    },
  );

  return {
    pixels: numDiffPixels,
    image: PNG.sync.write(diff),
  };
};

module.exports = pngDiff;
