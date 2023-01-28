const {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  PrivateKey,
  ScheduleCreateTransaction,
  ScheduleSignTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function signScheduleTransaction(scheduleTxId) {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const secondAccountId = process.env.SECOND_ACCOUNT_ID;
  const secondPrivateKey = PrivateKey.fromString(
    process.env.SECOND_PRIVATE_KEY
  );
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  //Create the transaction
  const transaction = await new ScheduleSignTransaction()
    .setScheduleId(scheduleTxId)
    .freezeWith(client);

  const signedTx = await (
    await transaction.sign(myPrivateKey)
  ).sign(secondPrivateKey);

  //Sign with the client operator key to pay for the transaction and submit to a Hedera network
  const txResponse = await signedTx.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction status
  const transactionStatus = receipt.status;
  console.log("The transaction consensus status is " + transactionStatus);
}

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

async function scheduleTranasction(amount) {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const secondAccountId = process.env.SECOND_ACCOUNT_ID;
  const secondPrivateKey = PrivateKey.fromString(
    process.env.SECOND_PRIVATE_KEY
  );

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  const tx = new TransferTransaction()
    .addHbarTransfer(myAccountId, -amount)
    .addHbarTransfer("0.0.4", amount * 2)
    .addHbarTransfer(secondAccountId, -amount);

  //Create a schedule transaction
  const transaction = new ScheduleCreateTransaction()
    //.setExpirationTime()
    //.setPayerAccountId()
    .setScheduleMemo(new Date().toString())
    .setScheduledTransaction(tx);
  //Sign with the client operator key and submit the transaction to a Hedera network
  const txResponse = await transaction.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the schedule ID
  const scheduleId = receipt.scheduleId;
  console.log("The schedule ID of the schedule transaction is " + scheduleId);
  return scheduleId;
}

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const secondAccountId = process.env.SECOND_ACCOUNT_ID;
  await queryBalance(myAccountId);
  await queryBalance(secondAccountId);
  const scheduleTxId = await scheduleTranasction(3);
  await signScheduleTransaction(scheduleTxId);
  await queryBalance(myAccountId);
  await queryBalance(secondAccountId);
}

main();
