console.clear();
require("dotenv").config();
const {
  PrivateKey,
  Client,
  TransferTransaction,
  AccountBalanceQuery,
  TokenFreezeTransaction,
  TokenUnfreezeTransaction,
  TokenWipeTransaction,
} = require("@hashgraph/sdk");
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function transferToken(senderId, receiverId, tokenId, amount) {
  const sendToken = await new TransferTransaction()
    .addTokenTransfer(tokenId, senderId, -amount)
    .addTokenTransfer(tokenId, receiverId, amount)
    .execute(client);

  let receipt = await sendToken.getReceipt(client);
  console.log("Transfer Token: ", receipt.status.toString());
}

async function freezeToken(accountId, tokenId) {
  console.log("FreezeToken-----------------------");
  const transaction = await new TokenFreezeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);
  console.log("Freeze token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function unfreezeToken(accountId, tokenId) {
  console.log("UnfreezeToken----------------------");
  const transaction = await new TokenUnfreezeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);
  console.log("Unfreeze token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function queryAccountBalance(accountId) {
  console.log("QueryAccountBalance----------------");
  const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
  const accountBalance = await balanceQuery.execute(client);
  console.log(JSON.stringify(accountBalance, null, 4));
  console.log("-----------------------------------");
}

async function wipeToken(accountId, tokenId, amount) {
  const transaction = await new TokenWipeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .setAmount(amount)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log(
    "The transaction consensus status is " + receipt.status.toString()
  );
}

async function main() {
  const tokenId = "0.0.754515";
  await queryAccountBalance(secondAccountId);
  await transferToken(myAccountId, secondAccountId, tokenId, 100);
  await queryAccountBalance(secondAccountId);
  await wipeToken(secondAccountId, tokenId, 20);
  await queryAccountBalance(secondAccountId);
  //   await freezeToken(secondAccountId, tokenId);
  //   await unfreezeToken(secondAccountId, tokenId);
  //   await transferToken(myAccountId, secondAccountId, tokenId, 100);
}
main();
