console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractCreateFlow,
  ContractInfoQuery,
} = require("@hashgraph/sdk");

const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

async function deploySmartContract() {
  //Import the compiled contract from the HelloHedera.json file
  let helloHedera = require("./contracts/MyContract.json");
  const bytecode = helloHedera.bytecode;

  const contractCreate = new ContractCreateFlow()
    .setGas(1000000)
    .setBytecode(bytecode);

  const contractResponse = await contractCreate.execute(client);
  const contractReceipt = await contractResponse.getReceipt(client);
  const newContractId = contractReceipt.contractId;

  console.log("The smart contract ID is " + newContractId);
  return newContractId;
}

async function getSmartContractInfo(contractId) {
  //Create the query
  const query = new ContractInfoQuery().setContractId(contractId);

  //Sign the query with the client operator private key and submit to a Hedera network
  const info = await query.execute(client);

  console.log(info);
}

async function main() {
  const contractId = await deploySmartContract();
  await getSmartContractInfo(contractId);
}

main();
