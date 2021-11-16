const { assert } = require("chai");

const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");
// const compiledFactory = require("../ethereum/build/CampaignFactory.json");
// const compiledCampaign = require("../ethereum/build/Campaign.json");

let factory;
let campaignAddress;
let campaign;

require("chai").use(require("chai-as-promised")).should();

contract("Campaign", ([_, author, contributor, recipient]) => {
  beforeEach(async () => {
    factory = await CampaignFactory.new({ from: _ });
    await factory.createCampaign("100", { from: author });
    [campaignAddress] = await factory.getDeployedCampaigns();
    campaign = await Campaign.at(campaignAddress);
  });

  it("deploys successfully", async () => {
    const factoryAddress = await factory.address;
    const campaignAddress = await campaign.address;
    assert.ok(factoryAddress, 0x0);
    assert.notEqual(factoryAddress, "");
    assert.notEqual(factoryAddress, null);
    assert.notEqual(factoryAddress, undefined);
    assert.ok(campaignAddress, 0x0);
    assert.notEqual(campaignAddress, "");
    assert.notEqual(campaignAddress, null);
    assert.notEqual(campaignAddress, undefined);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.manager();
    assert.strictEqual(author, manager);
  });

  it("Allows people to contribute money and marks them as approvers", async () => {
    await campaign.contribute({ from: contributor, value: "200" });
    const isContributor = await campaign.contributors(contributor);
    assert(isContributor);
  });

  it("Requires a minimum contribution", async () => {
    campaign.contribute({ from: contributor, value: "5" }).should.be.rejected;
  });

  it("Allows a manager to make a payment request", async () => {
    await campaign.createRequest("Buy batteries", "100", recipient, {
      from: author,
    });
    const request = await campaign.requests(0);
    assert.strictEqual(request.recipient, recipient);
    assert.strictEqual(request.description, "Buy batteries");
  });

  it("processes requests", async () => {
    await campaign.contribute({
      from: contributor,
      value: web3.utils.toWei("10", "ether"),
    });

    let requestValue = web3.utils.toWei("5", "ether");

    await campaign.createRequest("A", requestValue, recipient, {
      from: author,
    });

    await campaign.createRequest("B", requestValue, recipient, {
      from: author,
    });

    expectedSummary = {};

    summary = await campaign.getSummary();

    minContribution = new web3.utils.BN(summary[0]).toString();
    campaignBalance = new web3.utils.BN(summary[1]).toString();
    requestsCount = new web3.utils.BN(summary[2]).toString();
    contributorsCount = new web3.utils.BN(summary[3]).toString();
    managerAddress = summary[4];

    assert.equal(minContribution, "100", "minContribution is incorrect");
    assert.equal(requestsCount, "2", "requestsCount is incorrect");
    assert.equal(contributorsCount, "1", "contributorsCount is incorrect");
    assert.equal(
      campaignBalance,
      web3.utils.toWei("10", "ether"),
      "campaignBalance is incorrect"
    );
    assert.equal(managerAddress, author, "managerAddress is incorrect");

    await campaign.approveRequest(0, { from: contributor });

    let previousBalance = await web3.eth.getBalance(recipient);
    previousBalance = new web3.utils.BN(previousBalance);

    await campaign.finalizeRequest(0, { from: author });

    let currentBalance = await web3.eth.getBalance(recipient);
    currentBalance = new web3.utils.BN(currentBalance);

    requestValue = new web3.utils.BN(requestValue);
    const expectedBalance = previousBalance.add(requestValue);
    assert.equal(currentBalance.toString(), expectedBalance.toString());
  });

  it("Same account, multiple contributions, but only one contributor", async () => {
    await campaign.contribute({
      from: contributor,
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.contribute({
      from: contributor,
      value: web3.utils.toWei("5", "ether"),
    });

    const contributorsCount = await campaign.contributorsCount();
    assert.equal(contributorsCount.toNumber(), 1);

    const campaignBalance = await web3.eth.getBalance(campaignAddress);

    assert.equal(
      new web3.utils.BN(campaignBalance).toString(),
      new web3.utils.BN(web3.utils.toWei("10", "ether"))
        .add(new web3.utils.BN(web3.utils.toWei("5", "ether")))
        .toString()
    );
  });
});
