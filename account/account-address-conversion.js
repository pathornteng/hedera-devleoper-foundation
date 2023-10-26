const { AccountId, ContractId } = require("@hashgraph/sdk");

const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

async function idtoEvmAddress(accountId) {
  const response = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`
  );
  return response.data.evm_address;
}

async function evmAddressToId(evmAddress) {
  const response = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/accounts/${evmAddress}`
  );
  return response.data.account;
}

async function main() {
  let accountId = AccountId.fromString("0.0.3");
  let contractId = ContractId.fromString("0.0.5775057");
  console.log("Contract address from the SDK ", contractId.toSolidityAddress());
  console.log(
    "Contract address from the mirror node",
    await idtoEvmAddress(contractId.toString())
  );
  console.log("EVM address from the SDK", accountId.toSolidityAddress());
  const evmAddress = await idtoEvmAddress(accountId.toString());
  console.log("EVM address from the mirror node " + evmAddress);
  accountId = await evmAddressToId(evmAddress);
  console.log("AccountId from the mirror node" + accountId);
}

void main();
