console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  TopicDeleteTransaction,
} = require("@hashgraph/sdk");

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(operatorId, operatorKey);

async function main() {
  new TopicMessageQuery()
    .setTopicId("0.0.24813")
    //.setStartTime(0)
    //.setLimit(2)
    .subscribe(client, null, (message) => {
      let messageAsString = Buffer.from(message.contents, "utf8").toString();
      console.log(
        `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
      );
    });
}
main();
