const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");

provider = new HDWalletProvider(
  "wallet secrect phrase",
  "https://rinkeby.infura.io/v3/rinkybyid"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });

  console.log("Contract deployed to", factory.options.address);
  provider.engine.stop();
};

deploy();

// Attempting to deploy from account 0x4D81895c49494416e4Ce6C2f0A7c84EaA269F335
// Contract deployed to 0xd2fDfC8064F54a05cBa27456881355548aCbeB68
