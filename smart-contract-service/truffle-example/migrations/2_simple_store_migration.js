const SimpleStore = artifacts.require("simplestore");

module.exports = function (deployer) {
  deployer.deploy(SimpleStore);
};
