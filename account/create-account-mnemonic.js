const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  Mnemonic,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create new keys from mnemomics
  const mnemonicsString =
    "engage element country comfort chase oxygen biology rescue network produce seat imitate ketchup still security analyst shoulder board album require shuffle argue decorate language";
  const mnemomics = await Mnemonic.fromString(mnemonicsString);
  const newAccountPrivateKey = await mnemomics.toStandardEd25519PrivateKey();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.from(1000))
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
}
main();
