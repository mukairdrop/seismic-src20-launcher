import {
  createWalletClient,
  custom
} from 'https://esm.sh/viem'

import {
  seismicDevnet
} from 'https://esm.sh/viem/chains'

let walletClient
let account

// ==========================
// PASTE YOUR FACTORY ADDRESS
// ==========================

const factoryAddress = "0x4dcF3e0223c90DbB13Dc07c7C8d338eEf3D6815F"

const factoryAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// ==========================
// CONNECT WALLET
// ==========================

window.connectWallet = async () => {

  if (!window.ethereum) {

    alert("Please install MetaMask")

    return
  }

  try {

    walletClient = createWalletClient({
      chain: seismicDevnet,
      transport: custom(window.ethereum),
    })

    const accounts =
      await walletClient.requestAddresses()

    account = accounts[0]

    document.getElementById("status").innerText =
      "✅ Connected:\n" + account

  } catch (err) {

    console.log(err)

    document.getElementById("status").innerText =
      "❌ Wallet Connection Failed"
  }
}

// ==========================
// DEPLOY TOKEN
// ==========================

window.deployToken = async () => {

  if (!account) {

    alert("Connect wallet first")

    return
  }

  const name =
    document.getElementById("name").value

  const symbol =
    document.getElementById("symbol").value

  const supply =
    document.getElementById("supply").value

  // ==========================
  // VALIDATION
  // ==========================

  if (!name || !symbol || !supply) {

    alert("Fill all fields")

    return
  }

  try {

    document.getElementById("status").innerText =
      "⏳ Waiting for wallet confirmation..."

    // ==========================
    // SEND TRANSACTION
    // ==========================

    const hash =
      await walletClient.writeContract({

        address: factoryAddress,

        abi: factoryAbi,

        functionName: 'createToken',

        args: [
          name,
          symbol,
          BigInt(supply)
        ],

        account
      })

    // ==========================
    // SUCCESS MESSAGE
    // ==========================

    document.getElementById("status").innerText =
      `🎉 Token Successfully Deployed!

TX Hash:
${hash}`

    // ==========================
    // CONFETTI EFFECT
    // ==========================

    confetti({
      particleCount: 250,
      spread: 150,
      origin: { y: 0.6 }
    })

  } catch(err) {

    console.log(err)

    document.getElementById("status").innerText =
      "❌ Deployment Failed"
  }
}
