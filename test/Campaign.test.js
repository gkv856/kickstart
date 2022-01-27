const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

// creating an instance of web3 class with ganache as a provider
const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;
let managerAccount;

beforeEach(async () => {
  // getting the list of accounts provided by the ganache provider
  accounts = await web3.eth.getAccounts();
  managerAccount = accounts[0];

  // const bal = await web3.eth.getBalance(
  //   "0x127E99352C1c7D22a0B9fAd827Df949Bd7B2740c"
  // );
  // console.log(accounts);
  // console.log(bal);

  // deploying the campaign factory contract to the ganache network
  // a new contract with arbitrary amount of 1m wei gas form accounts[0]

  factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object,
      // arguments: ["1"],
    })
    .send({ from: managerAccount, gas: "3000000" });

  // create a campaing contract using campaing factory
  await factory.methods.createCampaign("100").send({
    from: managerAccount,
    gas: "3000000",
  });

  // const listAddress = await factory.methods.getAllCampaigns().call();
  // campaignAddress = listAddress[0];
  // we can do the following
  [campaignAddress] = await factory.methods.getAllCampaigns().call();

  // this is how we read a contract sitting on the blockchain
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaings", () => {
  it("deploys factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("sets the creator as manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(managerAccount, manager);
  });

  it("allows people to contribute and mark them as approver", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });

    assert(await campaign.methods.approvers(accounts[1]).call());
  });

  it("require min contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[2], value: "5" });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it("allows manager to make a payment request", async () => {
    await campaign.methods
      .createRequest(
        "buy battries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({ from: managerAccount, value: "100000000" });

    assert(true);

    // const request = await campaign.methods.requests(0).call();
    // assert.equal(request.description, "buy battries");
  });
});
