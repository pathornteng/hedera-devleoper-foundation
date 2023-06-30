const {
  AccountId,
  PrivateKey,
  Client,
  TransferTransaction,
  AccountInfoQuery,
  TransactionReceiptQuery,
  TopicCreateTransaction,
} = require("@hashgraph/sdk");

const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

async function accountIdtoEvmAddress(accountId) {
  const response = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`
  );
  return response.data.evm_address;
}

async function evmAddressToAccountId(evmAddress) {
  const response = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/accounts/${evmAddress}`
  );
  return response.data.account;
}

async function main() {
  const evmAddress = await accountIdtoEvmAddress("0.0.15013007");
  console.log("EVM address " + evmAddress);
  const accountId = await evmAddressToAccountId(evmAddress);
  console.log("AccountId " + accountId);
}

void main();
