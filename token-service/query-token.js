console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  //Create the query
  const balanceQuery = new AccountBalanceQuery().setAccountId(operatorId);

  //Sign with the client operator private key and submit to a Hedera network
  const tokenBalance = await balanceQuery.execute(client);

  console.log(tokenBalance);
}
main();
