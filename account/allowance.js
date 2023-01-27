const {
  Client,
  PrivateKey,
  AccountId,
  AccountAllowanceApproveTransaction,
  Hbar,
  AccountInfoQuery,
  TransferTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const secondAccountId = AccountId.fromString(process.env.SECOND_ACCOUNT_ID);
  const secondPrivateKey = PrivateKey.fromString(
    process.env.SECOND_PRIVATE_KEY
  );

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  const allowance = await new AccountAllowanceApproveTransaction()
    .approveHbarAllowance(myAccountId, secondAccountId, Hbar.from(100))
    .execute(client);

  //Request the receipt of the transaction
  const receipt = await allowance.getReceipt(client);

  console.log("Approved allowance", receipt.status.toString());

  const accountInfoQuery = await new AccountInfoQuery()
    .setAccountId(secondAccountId)
    .execute(client);

  //Create the transfer transaction
  client.setOperator(secondAccountId, secondPrivateKey);
  const sendHbar = await new TransferTransaction()
    .addApprovedHbarTransfer(myAccountId, -100)
    .addHbarTransfer(secondAccountId, 100)
    .execute(client);

  const sendHbarReceipt = await sendHbar.getReceipt(client);
  console.log(sendHbarReceipt.status.toString());
}
main();
