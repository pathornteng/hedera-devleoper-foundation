console.clear();
require("dotenv").config();
const {
  Client,
  TokenCreateTransaction,
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
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function createToken() {
  console.log("CreateToken---------------------");
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("MyToken")
    .setTokenSymbol("MYT")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(10000)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(myPrivateKey)
    .setFreezeKey(myPrivateKey)
    .setPauseKey(myPrivateKey)
    .setAdminKey(myPrivateKey)
    .setWipeKey(myPrivateKey)
    //.setKycKey(myPrivateKey)
    .freezeWith(client);

  let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey);
  let tokenCreateSubmit = await tokenCreateSign.execute(client);
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
  let tokenId = tokenCreateRx.tokenId;
  console.log(`- Created token with ID: ${tokenId}`);
  console.log("-----------------------------------");
  return tokenId;
}

async function queryTokenInfo(tokenId) {
  console.log("QueryTokenInfo---------------------");
  const query = new TokenInfoQuery().setTokenId(tokenId);
  const tokenInfo = await query.execute(client);
  console.log(JSON.stringify(tokenInfo, null, 4));
  console.log("-----------------------------------");
}

async function queryAccountBalance(accountId) {
  console.log("QueryAccountBalance----------------");
  const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
  const accountBalance = await balanceQuery.execute(client);
  console.log(JSON.stringify(accountBalance, null, 4));
  console.log("-----------------------------------");
}

async function mintToken(tokenId, amount) {
  console.log("MintToken--------------------------");
  const txResponse = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(amount)
    .execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log("Minted token: ", receipt);
  console.log("-----------------------------------");
}

async function burnToken(tokenId, amount) {
  console.log("BurnToken--------------------------");
  const txResponse = await new TokenBurnTransaction()
    .setTokenId(tokenId)
    .setAmount(amount)
    .execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log("Minted token: ", receipt);
  console.log("-----------------------------------");
}

async function main() {
  const tokenId = await createToken();
  await queryTokenInfo(tokenId);
  await queryAccountBalance(myAccountId);
  await mintToken(tokenId, 1000);
  await queryAccountBalance(myAccountId);
  await burnToken(tokenId, 500);
  await queryAccountBalance(myAccountId);
}
main();
