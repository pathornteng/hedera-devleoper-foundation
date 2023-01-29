console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  FileInfoQuery,
  FileContentsQuery,
  FileUpdateTransaction,
  FileDeleteTransaction,
} = require("@hashgraph/sdk");

const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

async function createFile() {
  console.log("----- CreateFile -------");
  //Create the transaction
  const transaction = await new FileCreateTransaction()
    .setKeys([operatorKey])
    .setContents("Hello World")
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log("The new file ID is: " + receipt.fileId);
  return receipt.fileId;
}

async function getFileInfo(fileId) {
  console.log("----- GetFileInfo -------");
  //Create the query
  const query = new FileInfoQuery().setFileId(fileId);
  //Sign the query with the client operator private key and submit to a Hedera network
  const fileInfo = await query.execute(client);
  console.log(JSON.stringify(fileInfo, null, 4));
}

async function getFileContent(fileId) {
  console.log("----- GetFileContent -------");
  //Create the query
  const query = new FileContentsQuery().setFileId(fileId);
  //Sign with client operator private key and submit the query to a Hedera network
  const contents = await query.execute(client);
  console.log(contents.toString());
}

async function updateFile(fileId) {
  console.log("----- UpdateFile -------");
  //Create the transaction
  const transaction = await new FileUpdateTransaction()
    .setFileId(fileId)
    .setContents("The new contents")
    .execute(client);

  //Request the receipt
  const receipt = await transaction.getReceipt(client);
  console.log(`Updated file ${fileId} ` + receipt.status.toString());
}

async function deleteFile(fileId) {
  console.log("----- DeleteFile -------");
  //Create the transaction
  const transaction = await new FileDeleteTransaction()
    .setFileId(fileId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);

  console.log(`Delete file ${fileId} ` + receipt.status.toString());
}

async function main() {
  const fileId = await createFile();
  await getFileInfo(fileId);
  await getFileContent(fileId);
  await updateFile(fileId);
  await getFileContent(fileId);
  await deleteFile(fileId);
  await getFileContent(fileId);
  await getFileInfo(fileId);
  // await getFileContent("0.0.102"); < network address book
  // await getFileInfo("0.0.102"); < network address book
}

main();
