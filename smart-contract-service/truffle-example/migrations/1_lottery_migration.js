const Lottery = artifacts.require("lottery");

module.exports = function (deployer) {
  deployer.deploy(Lottery);
};
