const CampaignFacfory = artifacts.require("CampaignFactory");

module.exports = function (deployer) {
  deployer.deploy(CampaignFacfory);
};
