const { utils, ethers } = require("ethers");
const MyContract = require("./build/contracts/Lottery.json");
const dotenv = require("dotenv");
dotenv.config();

const enter = async () => {
  const contractAddress = process.env.LOTTERY_CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSON_RPC_RELAY_URL
  );
  const signer = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

  const contract = new ethers.Contract(contractAddress, MyContract.abi, signer);
  var options = {
    gasLimit: 10_000_000,
    gasPrice: 2_460_000_000_000,
    value: ethers.utils.parseEther("100"),
  };

  const tx = await contract.enter(options);
  const txReceipt = await tx.wait();
  console.log("txReceipt", txReceipt);

  console.log("players", await contract.getPlayers());
};

const pickWiner = async () => {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSON_RPC_RELAY_URL
  );
  const signer = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);
  console.log("Address", signer.address);
  const balance = await provider.getBalance(signer.address);
  console.log("Account balance", ethers.utils.formatEther(balance), "Hbar");
  const gasPrice = await provider.getGasPrice();
  console.log("Gas Price", gasPrice.toString());

  const contract = new ethers.Contract(contractAddress, MyContract.abi, signer);
  console.log("Contract", await contract.populateTransaction.getPlayers());
  var options = {
    gasLimit: 10_000_000,
    gasPrice: 2_460_000_000_000,
    //value: ethers.utils.parseEther("100"),
  };

  const tx = await contract.pickWinner(options);
  const txReceipt = await tx.wait();

  console.log("txReceipt", txReceipt);
  // console.log("gasUsed", txReceipt.gasUsed.toString());
  // console.log("cumulativeGasUsed", txReceipt.cumulativeGasUsed.toString());
  // console.log("gasPrice", txReceipt.effectiveGasPrice.toString());
};

const main = async () => {
  await enter();
  //await pickWiner();
};

main();
