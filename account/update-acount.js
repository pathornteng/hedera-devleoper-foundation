const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountUpdateTransaction,
  Hbar,
  AccountBalanceQuery,
  AccountInfoQuery,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function createAccount() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.from(10))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  console.log("The new account ID is: " + newAccountId);
  console.log("New private Key: ", newAccountPrivateKey.toString());

  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log("The new account balance is: " + accountBalance.hbars.toString());
  return [newAccountId, newAccountPrivateKey];
}

async function main() {
  const [accountId, privateKey] = await createAccount();
  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  let accountInfoQuery = await new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client);

  console.log("Account public key", accountInfoQuery.key.toString());

  const newKey = PrivateKey.fromStringECDSA(
    "3030020100300706052b8104000a0422042066556aa2d0245a25aff4b98cbe417e3fc7e850e095c064dbaef2de2798338326"
  );

  console.log("New private Key: ", newKey.toString());
  console.log("New public Key: ", newKey.publicKey.toString());

  //Create a new account with 1,000 tinybar starting balance
  const transaction = await new AccountUpdateTransaction()
    .setAccountId(accountId)
    .setKey(newKey)
    .freezeWith(client);

  //Sign the transaction with the old key and new key
  const signTx = await (await transaction.sign(privateKey)).sign(newKey);
  //Sign the transaction with the client operator private key and submit to a Hedera network
  const txResponse = await signTx.execute(client);
  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);
  console.log("Changed key", receipt.status.toString());

  client.setOperator(accountId, newKey);

  accountInfoQuery = await new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client);

  console.log("Account public key", accountInfoQuery.key.toString());
}
main();
