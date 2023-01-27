const { PrivateKey } = require("@hashgraph/sdk");

async function main() {
  const privateKeyED = PrivateKey.generateED25519();
  const publicKeyED = privateKeyED.publicKey;
  console.log("- Generated ED25519 Key");
  console.log("Private Key (ED25519, DER)", privateKeyED.toStringDer());
  console.log("Private Key (ED25519, RAW)", privateKeyED.toStringRaw());
  console.log("Public Key (ED25519, DER)", publicKeyED.toStringDer());
  console.log("Public Key (ED25519, RAW)", publicKeyED.toStringRaw());
  // console.log("Ethereum Address", publicKeyED.toEthereumAddress().toString());
  console.log("------------------------");
  console.log("- Generated ECDSA Key");
  const privateKeyEC = PrivateKey.generateECDSA();
  const publicKeyEC = privateKeyEC.publicKey;
  console.log("Private Key (ECDSA, DER)", privateKeyEC.toStringDer());
  console.log("Private Key (ECDSA, RAW)", privateKeyEC.toStringRaw());
  console.log("Public Key (ECDSA, DER)", publicKeyEC.toStringDer());
  console.log("Public Key (ECDSA, RAW)", publicKeyEC.toStringRaw());
  console.log("Ethereum Address", publicKeyEC.toEthereumAddress().toString());
}

main();
