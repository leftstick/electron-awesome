const puppeteer = require('puppeteer')
const electron = require('electron')
const { BingEvent } = require('./events')
const { makeId } = require('../util')

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')
}

/**
 *
 * @param {string} pageUrl
 * @param {puppeteer.Browser} browser
 */
async function getPageResult(pageUrl, browser) {
  const page = await browser.newPage()
  await page.goto(pageUrl)
  await page.waitForSelector('#b_footer')

  const elements = await page.$$('#b_results li.b_algo')

  const searchResultPromises = elements.map(async (e) => {
    const title = (await e.$eval('div h2', (e) => e && e.innerText)) || (await e.$eval('h2', (e) => e && e.innerText))
    const link = (await e.$eval('div h2 a', (e) => e && e.href)) || (await e.$eval('h2 a', (e) => e && e.href))
    let description = ''
    try {
      description = await e.$eval('.b_caption p', (e) => e.innerText)
    } catch (error) {
      // ignore
    }
    return {
      id: makeId(10),
      title,
      link,
      description,
    }
  })

  const searchResult = await Promise.all(searchResultPromises)
  try {
    page.close()
  } catch (error) {
    // ignore
  }
  return searchResult.filter((res) => res.title && res.description && res.link)
}

let browser = null

async function searchInBing({ text }) {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: getChromiumExecPath(),
    })
  }

  const searchResult = await Promise.all([
    getPageResult(`https://bing.com/search?q=${text}`, browser),
    getPageResult(`https://bing.com/search?q=${text}&first=10`, browser),
    getPageResult(`https://bing.com/search?q=${text}&first=20`, browser),
  ])

  return searchResult.reduce((prev, cur) => prev.concat(cur), [])
}

/**
 *
 * @param {electron.BrowserWindow} browser
 */
module.exports.bingSearchRunner = function (browser) {
  electron.ipcMain.on(BingEvent.BING_PROXY_START_SEARCH, (e, text) => {
    searchInBing({ text })
      .then((result) => {
        browser.webContents.send(BingEvent.BING_PROXY_FINISH, result)
      })
      .catch((err) => {
        browser.webContents.send(BingEvent.BING_PROXY_ERROR, err)
      })
  })
}
