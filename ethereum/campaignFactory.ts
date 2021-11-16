import web3 from "./web3";
import CampaignFactory from "./build/contracts/CampaignFactory.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { toast } from "react-toastify";

const getFactoryContract = async (): Promise<Contract> => {
  const networkId = await web3.eth.net.getId();
  const networks: any = CampaignFactory.networks;
  const networkData = networks[networkId.toString()];
  if (networkData) {
    const campaignFactory = new web3.eth.Contract(
      CampaignFactory.abi as AbiItem[],
      networkData.address
    );
    return campaignFactory;
  } else {
    toast.error("This dApp is not deployed to detected network", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    throw "Contract not found";
  }
};

export { getFactoryContract };
