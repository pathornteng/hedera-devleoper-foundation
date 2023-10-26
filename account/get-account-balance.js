const { Client, AccountBalanceQuery } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create a new account with 1,000 tinybar starting balance
  const accountBalances = await new AccountBalanceQuery()
    .setAccountId("0.0.6295")
    .execute(client);

  console.log(accountBalances.tokens.get("0.0.2300256").toString());
}
main();
