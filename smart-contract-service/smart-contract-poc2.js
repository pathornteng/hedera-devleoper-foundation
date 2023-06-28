console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractInfoQuery,
  Hbar,
} = require("@hashgraph/sdk");

const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

async function queryMessage() {
  const contractQuery = await new ContractCallQuery()
    .setGas(1000000)
    .setContractId("0.0.4381822") // shinhan=0.0.3884376, mycontract=0.0.3892910
    .setFunction(
      "quoteRemit",
      new ContractFunctionParameters()
        .addAddress("0x000000000000000000000000000000000043D3eA")
        .addAddress("0x00000000000000000000000000000000004623f8")
        .addUint64(200000)
    )
    .setQueryPayment(new Hbar(10));

  console.log(await contractQuery.getCost(client));

  //Submit to a Hedera network
  const getMessage = await contractQuery.execute(client);

  // Get a string from the result at index 0
  const message = getMessage.getUint64(0);

  //Log the message
  console.log("The contract message: " + message);
}

async function main() {
  await queryMessage();
}

main();
