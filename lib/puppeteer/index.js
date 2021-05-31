const { promises: fs } = require('fs');
const puppeteer = require('puppeteer');
const adblocker = require('@cliqz/adblocker-puppeteer');
const crossFetch = require('cross-fetch');
const { default: PQueue } = require('p-queue');

const {
  MAX_PAGES,
} = process.env;

const queue = new PQueue({
  concurrency: parseInt(MAX_PAGES),
  timeout: 30e3,
  throwOnTimeout: true,
});

const cache = {
  browser: null,
  pages: null,
};

const initBrowser = async() => {
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

    cache.browser = await puppeteer.launch(options);
  }

  return cache.browser;
};

const initPages = async() => {
  if ( !cache.pages ) {
    const browser = await initBrowser();

    // browser starts with a single page
    for (let i = 1; i < parseInt(MAX_PAGES); i++) {
      await browser.newPage();
    }

    const pages = await browser.pages();

    try {
      const blocker = await adblocker.PuppeteerBlocker.fromPrebuiltAdsAndTracking(
        crossFetch,
        {
          path: 'engine.bin',
          read: fs.readFile,
          write: fs.writeFile,
        },
      );

      for ( const page of pages ) {
        blocker.enableBlockingInPage( page );
      }
    } catch ( ex ) {
      console.error( 'failed to initialize blocklist', ex );
    }

    for ( const page of pages ) {
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

      await page.setViewport({
        width: 1920,
        height: 1080,
      });
    }

    cache.pages = pages;
  }

  return cache.pages;
};

const pages = initPages();

const screenshot = async( url ) => {
  await pages;

  return queue.add(async() => {
    const page = cache.pages.shift(1);

    try {
      console.log( 'loading', url );

      await page.goto( url, {
        timeout: 30e3,
        waitUntil: 'load',
      });

      await page.waitForTimeout( 2e3 );

      console.log( 'taking screenshot of', url );

      return await page.screenshot();
    } finally {
      cache.pages.push( page );
    }
  });
};

module.exports = {
  screenshot,
};
