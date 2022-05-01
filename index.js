const bent = require('bent')
const getJSON = bent('GET', 'json')
const getConnex = require('./getConnex')
const { ethers } = require('@vechain/ethers')

const NETWORK_URL = 'https://mainnet.veblocks.net'
const ABI_URL = 'https://raw.githubusercontent.com/vechain/b32/master/ABIs/energy.json'
const CONTRACT_ADDRESS = '0x0000000000000000000000000000456E65726779'

async function getTotalSupply () {
  // get connex instance
  const connex = await getConnex(NETWORK_URL)

  // load relevant abi
  const abi = await getJSON(ABI_URL)
  const abiTotalSupply = abi.find(({ name }) => name === 'totalSupply')

  // request information from contract
  const {
    decoded: { 0: totalSupply }
  } = await connex.thor.account(CONTRACT_ADDRESS).method(abiTotalSupply).call()

  // return a formatted value
  return ethers.utils.formatEther(totalSupply)
}

async function getBalanceOf (address) {
  // get connex instance
  const connex = await getConnex(NETWORK_URL)

  // load relevant abi
  const abi = await getJSON(ABI_URL)
  const abiBalanceOf = abi.find(({ name }) => name === 'balanceOf')

  // request information from contract with an argument
  const {
    decoded: { 0: balance }
  } = await connex.thor.account(CONTRACT_ADDRESS).method(abiBalanceOf).call(address)

  // return a formatted value
  return ethers.utils.formatEther(balance)
}

async function main () {
  const totalSupply = await getTotalSupply()
  console.log(`Total VTHO Supply: ${totalSupply}`)

  const address = process.argv[2] || '0x04Ad3f13050cc766169433062BcDbB367B616986'
  const balance = await getBalanceOf(address)
  console.log(`Balance of ${address} is: ${balance}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
