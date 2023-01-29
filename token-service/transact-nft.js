console.clear();
require("dotenv").config();
const {
  PrivateKey,
  Client,
  TransferTransaction,
  AccountBalanceQuery,
  TokenNftInfoQuery,
  TokenId,
  NftId,
} = require("@hashgraph/sdk");
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function transferNFT(senderId, receiverId, nftId) {
  let tokenTransferTx = await new TransferTransaction()
    .addNftTransfer(nftId.tokenId, nftId.serial, senderId, receiverId)
    .execute(client);

  let tokenTransferRx = await tokenTransferTx.getReceipt(client);

  console.log(`\n- NFT transfer : ${tokenTransferRx.status.toString()} \n`);
}

async function nftInfoQuery(nftId) {
  console.log("NftInfoQuery----------------");
  //Returns the info for the specified NFT ID
  const nftInfo = await new TokenNftInfoQuery().setNftId(nftId).execute(client);
  console.log(JSON.stringify(nftInfo, null, 4));
  console.log("-----------------------------------");
}

async function main() {
  const tokenId = "0.0.768328";
  const nftId = new NftId(TokenId.fromString(tokenId), 2);
  console.log(nftId);
  await nftInfoQuery(nftId);
  await transferNFT(myAccountId, secondAccountId, nftId);
  await nftInfoQuery(nftId);
}
main();
