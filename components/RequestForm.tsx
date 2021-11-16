import React, { FC, useState } from "react";
import { useAppSelector } from "@store/hooks";
import getCampaign from "@ethereum/campaign";
import { useRouter } from "next/router";
import EtherInput from "./FormComponents/EtherInput";
import TextInput from "./FormComponents/TextInput";
import SubmitButton from "./FormComponents/SubmitButton";
import { toast } from "react-toastify";
import web3 from "@ethereum/web3";

const RequestForm: FC = () => {
  const router = useRouter();
  const [requestDescription, setRequestDescription] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  const accountState = useAppSelector((state) => state.account);

  const createRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    const campaignAddress = router.query.campaign as string;
    const campaign = getCampaign(campaignAddress);

    setLoading(true);
    await campaign.methods
      .createRequest(
        requestDescription,
        web3.utils.toWei(requestAmount, "ether"),
        requestRecipient
      )
      .send({
        from: accountState.address,
      })
      .on("receipt", () => {
        router.replace(`/campaigns/${campaignAddress}/requests`);
        toast.success("Request Created", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .on("error", (err: any) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <h4 className="my-2 font-bold">Create a Request</h4>
      <form onSubmit={createRequest}>
        <div className="w-full max-w-xs space-y-6">
          <TextInput label="Description" inputChange={setRequestDescription} />
          <EtherInput
            label="Amount"
            inputChange={setRequestAmount}
            unit="eth"
          />
          <TextInput label="recipient" inputChange={setRequestRecipient} />
          <SubmitButton
            text="Create!"
            disabled={
              +requestAmount === 0 ||
              (!requestRecipient && !accountState.address)
            }
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
