// migrations/2_deploy_contracts.js
const VotingAndFunding = artifacts.require("VotingAndFunding");

module.exports = function(deployer) {
    deployer.deploy(VotingAndFunding);
};
