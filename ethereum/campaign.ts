import { AbiItem } from "web3-utils";
import web3 from "./web3";
import Campaign from "./build/contracts/Campaign.json";

const campaign = (address: string) => {
  return new web3.eth.Contract(Campaign.abi as AbiItem[], address);
};

export default campaign;
