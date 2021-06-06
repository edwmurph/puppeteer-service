const { promises: fs } = require('fs');
const log = require('@starryinternet/jobi');
const puppeteer = require('puppeteer');
const adblocker = require('@cliqz/adblocker-puppeteer');
const crossFetch = require('cross-fetch');
const { default: PQueue } = require('p-queue');
const wait = require('../util/wait');

const {
  MAX_PAGES,
  WAIT_UNTIL = 'load',
  EXTRA_WAIT,
  QUEUE_TIMEOUT = 30e3,
} = process.env;

class Puppeteer {

  constructor() {
    this.queue = new PQueue({
      concurrency: parseInt(MAX_PAGES),
      timeout: parseInt(QUEUE_TIMEOUT),
      throwOnTimeout: true,
    });

    this.ready = this.init();
  }

  async init() {
    this.browser = await puppeteer.launch({
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    // browser starts with a single page
    for (let i = 1; i < parseInt(MAX_PAGES); i++) {
      await this.browser.newPage();
    }

    const pages = await this.browser.pages();

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
      log.error( 'failed to initialize blocklist', ex );
    }

    for ( const page of pages ) {
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

      await page.setViewport({
        width: 1920,
        height: 1080,
      });
    }

    this.pages = pages;
  }

  async task( fn ) {
    await this.ready;

    return this.queue.add( async() => {
      const page = this.pages.shift(1);

      try {
        return await fn( page );
      } finally {
        this.pages.push( page );
      }
    });
  }

  async screenshot({ ctx, url, extraWait = EXTRA_WAIT }) {
    return this.task(async( page ) => {
      ctx.state.log.info( 'taking screenshot' );

      await page.goto( url, {
        timeout: 30e3,
        waitUntil: WAIT_UNTIL,
      });

      await page.waitForTimeout( 2e3 );

      const screenshot = await page.screenshot();

      if ( extraWait ) {
        await wait( parseInt( extraWait ) );
      }

      ctx.state.log.info( 'finished taking screenshot' );

      return screenshot;
    });
  }

}

module.exports = Puppeteer;
