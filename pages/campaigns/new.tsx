import { useAppSelector } from "@store/hooks";
import React, { useState } from "react";
import { getFactoryContract } from "@ethereum/campaignFactory";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import EtherInput from "@components/FormComponents/EtherInput";
import SubmitButton from "@components/FormComponents/SubmitButton";

function NewCampaign() {
  const [minimumContribution, setMinimumContribution] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const accountState = useAppSelector((state) => state.account);
  const router = useRouter();

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const factoryContract = await getFactoryContract();
    if (factoryContract) {
      setloading(true);
      await factoryContract.methods
        .createCampaign(minimumContribution)
        .send({
          from: accountState.address,
        })
        .on("receipt", () => {
          router.push("/");
          toast.success("Campaign created successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .on("error", function (error: any) {
          console.error(error);
          setloading(false);
        });
    }
  };
  return (
    <div>
      <h4 className="my-2 font-bold">Create a Campaign</h4>
      <form onSubmit={createCampaign}>
        <div className="w-full max-w-xs">
          <EtherInput
            label="Minimum Contribution (wei)"
            unit="wei"
            inputChange={setMinimumContribution}
          />
          <SubmitButton
            disabled={
              +minimumContribution <= 0 || loading || !accountState.address
            }
            loading={loading}
            text="Create!"
          />
        </div>
      </form>
    </div>
  );
}

export default NewCampaign;
