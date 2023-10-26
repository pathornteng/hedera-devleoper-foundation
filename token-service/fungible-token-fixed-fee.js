console.clear();
require("dotenv").config();
const {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
  AccountBalanceQuery,
  PrivateKey,
  TokenMintTransaction,
  TokenBurnTransaction,
  CustomFixedFee,
  AccountId,
  TransferTransaction,
  Hbar,
  TokenAssociateTransaction,
  TokenInfo,
  TokenFeeScheduleUpdateTransaction,
} = require("@hashgraph/sdk");

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function createToken() {
  const customFee = new CustomFixedFee()
    .setAmount(1000000000)
    .setFeeCollectorAccountId(secondAccountId)
    .setAllCollectorsAreExempt(false);

  const customFee2 = new CustomFixedFee()
    .setAmount(2000000000)
    .setFeeCollectorAccountId(secondAccountId)
    .setAllCollectorsAreExempt(false);

  console.log("CreateToken---------------------");
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("MyToken")
    .setTokenSymbol("MYT")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(0)
    .setInitialSupply(10000)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setCustomFees([customFee, customFee2])
    .setFeeScheduleKey(myPrivateKey)
    .setMaxTransactionFee(new Hbar(40))
    .freezeWith(client);

  tokenCreateTx = await tokenCreateTx.sign(secondPrivateKey);

  let tokenCreateSubmit = await tokenCreateTx.execute(client);
  console.log("- Executed");
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
  let tokenId = tokenCreateRx.tokenId;
  console.log(`- Created token with ID: ${tokenId}`);
  console.log(`- Token Address ${tokenId.toSolidityAddress()}`);
  console.log("-----------------------------------");

  const query = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
  console.log(query);

  //Create the transaction and freeze for manual signing
  const transaction = await new TokenFeeScheduleUpdateTransaction()
    .setTokenId(tokenId)
    .setCustomFees([])
    .freezeWith(client);

  //Submit the signed transaction to a Hedera network
  const txResponse = await transaction.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status.toString();
  console.log("Remove Token Fee", transactionStatus.toString());

  const query2 = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
  console.log(query2);

  return tokenId;
}

async function main() {
  const tokenId = await createToken();
}
main();
