const {
  Client,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  AccountId,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  const bytecode = require("./nft.json");
  console.log(bytecode);
  // Create contract
  const createContract = new ContractCreateFlow()
    .setGas(4000000) // Increase if revert
    .setBytecode(bytecode.bytecode); // Contract bytecode
  const createContractTx = await createContract.execute(client);
  const createContractRx = await createContractTx.getReceipt(client);
  const contractId = createContractRx.contractId;

  console.log(`Contract created with ID: ${contractId} \n`);

  // Create NFT from precompile
  const createToken = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(4000000) // Increase if revert
    .setPayableAmount(50) // Increase if revert
    .setFunction(
      "createNft",
      new ContractFunctionParameters()
        .addString("Fall Collection") // NFT name
        .addString("LEAF") // NFT symbol
        .addString("Just a memo") // NFT memo
        .addInt64(250) // NFT max supply
        .addInt64(7000000) // Expiration: Needs to be between 6999999 and 8000001
    );
  const createTokenTx = await createToken.execute(client);
  const createTokenRx = await createTokenTx.getRecord(client);
  const tokenIdSolidityAddr =
    createTokenRx.contractFunctionResult.getAddress(0);
  const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);

  console.log(`Token created with ID: ${tokenId} \n`);

  // IPFS URI
  metadata =
    "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json";

  // Mint NFT
  const mintToken = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(4000000)
    .setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
    .setFunction(
      "mintNft",
      new ContractFunctionParameters()
        .addAddress(tokenIdSolidityAddr) // Token address
        .addBytesArray([Buffer.from(metadata)]) // Metadata
    );

  const mintTokenTx = await mintToken.execute(client);
  const mintTokenRx = await mintTokenTx.getRecord(client);
  const serial = mintTokenRx.contractFunctionResult.getInt64(0);

  console.log(`Minted NFT with serial: ${serial} \n`);
}
main();
