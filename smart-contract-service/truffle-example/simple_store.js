const { utils, ethers } = require("ethers");
const MyContract = require("./build/contracts/SimpleStore.json");
const Verify = require("./build/contracts/Verify.json");
const dotenv = require("dotenv");
dotenv.config();

const setNumber = async (number) => {
  const contractAddress = process.env.SIMPLESTORE_CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSON_RPC_RELAY_URL
  );
  const signer = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

  const contract = new ethers.Contract(contractAddress, MyContract.abi, signer);
  var options = {
    gasLimit: 10_000_000,
    gasPrice: 2_460_000_000_000,
  };

  const tx = await contract.set_number(number, options);
  const txReceipt = await tx.wait();
  console.log("txReceipt", txReceipt);
};

const getNumber = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSON_RPC_RELAY_URL
  );
  const contractAddress = process.env.SIMPLESTORE_CONTRACT_ADDRESS;
  const signer = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

  const verify = new ethers.Contract(contractAddress, Verify.abi, signer);
  console.log("THIS", await verify.populateTransaction.verifyDefaultMessage());
  return;
  //const contractAddress = process.env.SIMPLESTORE_CONTRACT_ADDRESS;

  const contract = new ethers.Contract(contractAddress, MyContract.abi, signer);
  const number = await contract.get_number();
  console.log(await contract.populateTransaction.get_number());
  console.log("current number", number.toString());
};

const main = async () => {
  //await setNumber(20);
  await getNumber();
};

main();
