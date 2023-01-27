const { Client } = require("@hashgraph/sdk");
require("dotenv").config();

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

async function main() {
  const testnetClient = Client.forTestnet();
  console.log(testnetClient.mirrorNetwork);
  console.log(testnetClient.network);

  const mainnetClient = Client.forMainnet();
  console.log(mainnetClient.mirrorNetwork);
  console.log(mainnetClient.network);

  const previewnetClient = Client.forPreviewnet();
  console.log(previewnetClient.mirrorNetwork);
  console.log(previewnetClient.network);

  const localClient = Client.forLocalNode();
  console.log(localClient.mirrorNetwork);
  console.log(localClient.network);
  localClient.setOperator(myAccountId, myPrivateKey);

  const node = { "127.0.0.1:50211": "0.0.3" };
  const customClient = Client.forNetwork(node).setMirrorNetwork(
    "custom.mirrornode.com:5600"
  );
  console.log(customClient.mirrorNetwork);
  console.log(customClient.network);

  console.log(
    localClient.operatorAccountId.toString(),
    localClient._operator.publicKey
  );
}

main();
