const {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  PrivateKey,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function queryBalance(accountId) {
  const client = Client.forTestnet();
  //client.setOperator(myAccountId, myPrivateKey);

  //Query account balance
  const accountBalanace = await new AccountBalanceQuery().setAccountId(
    accountId
  );

  const result = await accountBalanace.execute(client);
  console.log(accountId + " current hbar :", result.hbars.toString());
}

async function transferHbar(amount) {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const secondAccountId = process.env.SECOND_ACCOUNT_ID;
  const secondPrivateKey = PrivateKey.fromString(
    process.env.SECOND_PRIVATE_KEY
  );

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  const transferTransaction = new TransferTransaction()
    .addHbarTransfer(myAccountId, -amount)
    .addHbarTransfer("0.0.3", amount * 2)
    .addHbarTransfer(secondAccountId, -amount)
    .freezeWith(client);

  const signedTx = await (
    await transferTransaction.sign(myPrivateKey)
  ).sign(secondPrivateKey);
  const result = await signedTx.execute(client);
  const receipt = await result.getReceipt(client);

  console.log("Transfer ", receipt.status.toString());
}

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const secondAccountId = process.env.SECOND_ACCOUNT_ID;
  await queryBalance(myAccountId);
  await queryBalance(secondAccountId);
  await transferHbar(2);
  await queryBalance(myAccountId);
  await queryBalance(secondAccountId);
}

main();
