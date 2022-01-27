import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

// const contractAddress = "0xd2fDfC8064F54a05cBa27456881355548aCbeB68";
const contractAddress = "0x71c62004fe99B61E2991C196D89c74DFC55905e3";
const cfInstance = await new web3.eth.Contract(
  CampaignFactory.abi,
  contractAddress
);
export default cfInstance;
