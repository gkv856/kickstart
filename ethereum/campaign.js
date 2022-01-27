import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const campaignInstance = async (address) => {
  // console.log("got address: ", address);
  return await new web3.eth.Contract(Campaign.abi, address);
};

export default campaignInstance;
