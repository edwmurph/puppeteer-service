const { promises: fs } = require('fs');
const puppeteer = require('puppeteer');
const adblocker = require('@cliqz/adblocker-puppeteer');
const which = require('which');
const crossFetch = require('cross-fetch');

const cache = {
  browser: null,
  page: null,
};

const getBrowser = async() => {
  if ( !cache.browser ) {
    const options = {
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    };

    const chromiumPath = which.sync('chromium', { nothrow: true });

    if (chromiumPath) options.executablePath = chromiumPath;

    cache.browser = await puppeteer.launch(options);
  }

  return cache.browser;
};

const getPage = async() => {
  if ( !cache.page ) {
    const browser = await getBrowser();

    await browser.newPage();

    const [ page ] = await browser.pages();

    try {
      const blocker = await adblocker.PuppeteerBlocker.fromPrebuiltAdsAndTracking(
        crossFetch,
        {
          path: 'engine.bin',
          read: fs.readFile,
          write: fs.writeFile,
        },
      );

      blocker.enableBlockingInPage( page );
    } catch ( ex ) {
      console.error( 'failed to initialize blocklist', ex );
    }

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    cache.page = page;
  }

  return cache.page;
};

const screenshot = async( url ) => {
  const page = await getPage();

  await page.goto( url, {
    timeout: 30e3,
    waitUntil: 'load',
  });

  await page.waitForTimeout( 2e3 );

  return page.screenshot();
};

module.exports = {
  screenshot,
};
