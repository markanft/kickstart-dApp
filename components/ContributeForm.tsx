import { FC, useState } from "react";
import getCampaign from "@ethereum/campaign";
import { useAppSelector } from "@store/hooks";
import web3 from "@ethereum/web3";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ContributeForm: FC<{
  campaignAddress: string;
  minimumContribution: string;
}> = (props) => {
  const router = useRouter();
  const [contribution, setContribution] = useState("0");
  const [loading, setLoading] = useState(false);
  const accountState = useAppSelector((state) => state.account);
  const minContribution = web3.utils.fromWei(
    props.minimumContribution,
    "ether"
  );

  const contribute = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const campaign = getCampaign(props.campaignAddress);

    await campaign.methods
      .contribute()
      .send({
        from: accountState.address,
        value: web3.utils.toWei(contribution, "ether"),
      })
      .on("receipt", () => {
        router.replace(`/campaigns/${props.campaignAddress}`);
        setContribution("0");
        setLoading(false);
        toast.success("The contribution has been sent", {
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

    console.log("contribute");
  };
  return (
    <div>
      <h4 className="my-2">Contribute to this campaign</h4>
      <form onSubmit={contribute}>
        <div className="w-full max-w-xs">
          <div className="mt-4 relative rounded-md shadow-sm">
            <input
              type="number"
              step="any"
              name="contribution"
              id="contribution"
              value={contribution}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              onChange={(event) => {
                console.log(typeof event.target.value);
                setContribution(event.target.value);
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                eth
              </span>
            </div>
          </div>
          <button
            disabled={+contribution < +minContribution}
            type="submit"
            className={
              +contribution >= +minContribution && !loading
                ? "mt-4 items-center float-right px-2 py-2 rounded border font-medium text-base border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                : "mt-4 items-center float-right inline-flex px-2 py-2 rounded border font-medium text-base bg-blue-500 text-white opacity-50 cursor-not-allowed"
            }
          >
            Contribute!
            {loading && (
              <div className="pl-4">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContributeForm;
