const { Framework } = require('@vechain/connex-framework')
const { Driver, SimpleNet } = require('@vechain/connex-driver')

const connexStorage = {}

async function getConnex (url) {
  if (connexStorage[url]) {
    return connexStorage[url]
  }

  const driver = await Driver.connect(
    new SimpleNet(url)
  )
  connexStorage[url] = new Framework(driver)

  return connexStorage[url]
}

module.exports = getConnex
