const {
    Client,
    AccountId,
    PrivateKey,
    TransferTransaction,
    Hbar,
    Transaction,
    TransactionId,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const client = Client.forTestnet();

    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    //client.setOperator(operatorId, operatorKey);

    let transaction = new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-100))
        .addHbarTransfer(AccountId.fromString("0.0.3"), Hbar.fromTinybars(100))
        .setNodeAccountIds([AccountId.fromString("0.0.5")])
        .setTransactionId(TransactionId.generate(myAccountId))
        .freezeWith(client);

    // Get body bytes to sign 
    const bodyBytes = transaction._signedTransactions.get(0).bodyBytes

    // Sign with the private key
    const signature = myPrivateKey.sign(bodyBytes);

    transaction.addSignature(myPrivateKey.publicKey, signature);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log("Transaction status: " + receipt.status.toString());

    client.close();
}

void main();