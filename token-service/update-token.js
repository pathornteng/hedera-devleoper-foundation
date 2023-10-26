console.clear();
require("dotenv").config();
const {
  Client,
  TokenUpdateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
  AccountBalanceQuery,
  PrivateKey,
  TokenMintTransaction,
  TokenBurnTransaction,
} = require("@hashgraph/sdk");

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function updateToken(tokenId) {
  console.log("UpdateToken---------------------");
  let tokenCreateTx = await new TokenUpdateTransaction()
    .setTokenId(tokenId)
    .setTreasuryAccountId("0.0.3404218")
    .freezeWith(client);

  let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey);
  let tokenCreateSubmit = await tokenCreateSign.execute(client);
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
  return tokenId;
}

async function main() {
  await updateToken("0.0.19357");
}
main();
