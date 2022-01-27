const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// creating a path variable for the build directory
const buildPath = path.resolve(__dirname, "build");

// removing the build directory
fs.removeSync(buildPath);

// __dirname gives us the path to the current directory.
// in this case we are in ethereum folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const sourceCode = fs.readFileSync(campaignPath, "utf8");

// this output variable will store the complied source code of the smart contract
// as a dictionary.

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      "*": { "*": ["*"] },
    },
  },
};
console.log(JSON.parse(solc.compile(JSON.stringify(input))));
const outputContracts = JSON.parse(solc.compile(JSON.stringify(input)))
  .contracts["Campaign.sol"];
// console.log(outputContracts);
// create the directory
fs.ensureDirSync(buildPath);

// console.log(outputContracts);

for (let contract in outputContracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    outputContracts[contract]
  );
}
