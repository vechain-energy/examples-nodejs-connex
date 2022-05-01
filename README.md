# How to connect to the Blockchain using Node.js

## Connect

[Connex](https://docs.vechain.org/connex/) is the standard interface to connect dApps with VeChain blockchain and users.

For Node.js the connection is a little more complex than for the web:

```js
const { Framework } = require('@vechain/connex-framework')
const { Driver, SimpleNet } = require('@vechain/connex-driver')

const driver = await Driver.connect(new SimpleNet('https://mainnet.veblocks.net'))
const connex = new Framework(driver)
```

For the TestNet use `https://testnet.veblocks.net`.

## Interact

Once `connex` is available, the connection works identical to the web-version. See the example here:  
[How two connect to the Blockchain in the Browser](https://blog.vechain.energy/how-to-connect-to-the-blockchain-in-the-browser-86565299c122)

### Prepare

For an interaction we need to know:

1. The address of the contract we want to talk to (like an API or Hostname)
2. The ABI documentation of the function we want to call

For this example the current supply of VTHO will be read, the address for that contract is:

```
0x0000000000000000000000000000456E65726779
```

I did look it up in the official docs:  
https://docs.vechain.org/others/miscellaneous.html#energy-sol

The ABI definition  is available in the official docs as well:
https://raw.githubusercontent.com/vechain/b32/master/ABIs/energy.json

For this example only the single function `totalSupply()` is relevant, it is extracted from the list of all functions defined in the ABI:

```js
const abiTotalSupply = abi.find(({ name }) => name === "totalSupply");
```

### Execute

```js
    const result = await connex.thor
      .account(CONTRACT_ADDRESS)
      .method(abiTotalSupply)
      .call();
```

`result` contains a lot of noise. The expected information is found in `result.decoded`:

```
{ 0: "52418836757574038600000000000" }
```

Repeating this on each new block will return the current VTHO supply on the whole network.

### Arguments

The same functionality can be used with parameters. To get the balance of a single address:

```js
const abiBalanceOf = abi.find(({ name }) => name === "balanceOf");

 const { decoded } = await connex.thor
      .account(CONTRACT_ADDRESS)
      .method(abiBalanceOf)
      .call("0x04Ad3f13050cc766169433062BcDbB367B616986");

console.log('VTHO Balance:', decoded[0])
```


`call()` will verify against the ABI and an error is thrown if data format or number of arguments don't match. Be sure to handle errors correctly.

## Sandbox

There is a complete example project running the above example on the command line. You should play around with it:
https://gitlab.com/vechain.energy/examples/nodejs-connex

Also there is a code-sandbox that returns the balance using a webserver:
https://codesandbox.io/s/connect-to-vechain-using-connex-node-js-1s3jgo


## Notes

With the ability to read data from contracts using Node.js APIs or command lines you can now rely on blockchain data.

For example we implemented an access control management using the ownership of a NFT. It moved the full ownership to the user.

## Links

1. [Above Example Project](https://gitlab.com/vechain.energy/examples/nodejs-connex)
2. [Connex Docs](https://docs.vechain.org/connex/)
2. [B32 Collection of ABIs](https://github.com/vechain/b32/tree/master/ABIs)
