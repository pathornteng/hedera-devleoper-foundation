const {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  PrivateKey,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function queryBalance() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const client = Client.forTestnet();
  //client.setOperator(myAccountId, myPrivateKey);

  //Query account balance
  const accountBalanace = await new AccountBalanceQuery().setAccountId(
    myAccountId
  );

  const result = await accountBalanace.execute(client);
  console.log("My current hbar :", result.hbars.toString());
}

async function transferHbar(amount) {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  const transferTransaction = new TransferTransaction()
    .addHbarTransfer(myAccountId, -amount)
    .addHbarTransfer("0.0.3", amount)
    .freezeWith(client);

  console.log("Transaction Id", transferTransaction.transactionId.toString());
  console.log("Node Account Ids", transferTransaction.nodeAccountIds);
  console.log(
    "Transaction Valid Duration",
    transferTransaction.transactionValidDuration
  );
  console.log(
    "Frozen TX Signature",
    await transferTransaction.getSignatures()._map.get("0.0.7").toString()
  );

  const newPrivateKey = PrivateKey.generateED25519();
  const signedTx = await transferTransaction.sign(newPrivateKey);

  console.log(
    "Signed Tx Signature",
    await signedTx.getSignatures()._map.get("0.0.7").toString()
  );

  const transferHbar = await signedTx.execute(client);
  console.log("Transaction sent to", transferHbar.nodeId.toString());
  //const receipt = await transferHbar.getReceipt(client);

  const signedAgainTx = await transferTransaction.sign(
    PrivateKey.fromString(myPrivateKey)
  );

  console.log(
    "Signed Tx Signature",
    await signedAgainTx.getSignatures()._map.get("0.0.7").toString()
  );
  const transferHbarAgain = await signedAgainTx.execute(client);
  console.log("Transaction sent to", transferHbarAgain.nodeId.toString());
  const receipt2 = await transferHbarAgain.getReceipt(client);
}

async function main() {
  await queryBalance();
  await transferHbar(10);
  await queryBalance();
}

main();
