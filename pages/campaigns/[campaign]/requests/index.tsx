import React, { FC } from "react";
import getCampaign from "@ethereum/campaign";
import { GetStaticProps } from "next";
import web3 from "@ethereum/web3";
import { useAppSelector } from "@store/hooks";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

type Request = {
  description: string;
  value: string;
  recipient: string;
  complete: boolean;
  approvalCount: number;
  approvals: {} | undefined;
};

type Props = {
  requests: string;
  contributorsCount: string;
  managerAddress: string;
  campaignAddress: string;
  requestsCount: string;
};
const RequestsIndex: FC<Props> = (props) => {
  const requests: Request[] = JSON.parse(props.requests);
  const accountState = useAppSelector((store) => store.account);
  const allowFinalize = accountState.address === props.managerAddress;
  const router = useRouter();

  const getApproveFunc = (indexId: number) => {
    return async function () {
      const campaign = getCampaign(props.campaignAddress);
      await campaign.methods
        .approveRequest(indexId)
        .send({
          from: accountState.address,
        })
        .on("receipt", () => {
          router.replace(`/campaigns/${props.campaignAddress}/requests`);
          toast.success("Request approved successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    };
  };

  const getFinalizeFunc = (indexId: number) => {
    return async function () {
      const campaign = getCampaign(props.campaignAddress);
      await campaign.methods
        .finalizeRequest(indexId)
        .send({
          from: accountState.address,
        })
        .on("receipt", () => {
          router.replace(`/campaigns/${props.campaignAddress}/requests`);
          toast.success("Request finalized!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    };
  };

  return (
    <div>
      <h3 className="mb-4">Requests List</h3>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Recipient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Approval Count
                    </th>
                    {!allowFinalize && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Approve
                      </th>
                    )}
                    {allowFinalize && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Finalize
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {web3.utils.fromWei(request.value, "ether")} eth
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.recipient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.approvalCount} / {props.contributorsCount}
                      </td>
                      {/* Approve if is contributor */}
                      {!allowFinalize && !request.complete && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={getApproveFunc(index)}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-green-400 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Approve
                          </button>
                        </td>
                      )}
                      {/* Finalize if owner of campaign */}
                      {allowFinalize && !request.complete && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={getFinalizeFunc(index)}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-green-400 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Finalize
                          </button>
                        </td>
                      )}
                      {request.complete && (
                        <td className="px-6 py-4 bg-green-300 whitespace-nowrap text-right text-sm font-medium">
                          Completed
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <p>Found {props.requestsCount} requests. </p>
      <Link href={`/campaigns/${props.campaignAddress}/requests/new`} passHref>
        <button
          type="button"
          className="mt-8 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Request
        </button>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetStaticProps = async (context) => {
  const campaignAddress = context.params?.campaign;

  if (!campaignAddress || Array.isArray(campaignAddress)) {
    return {
      notFound: true,
    };
  }

  const campaign = getCampaign(campaignAddress);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const contributorsCount = await campaign.methods.contributorsCount().call();
  const managerAddress = await campaign.methods.manager().call();
  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill(undefined)
      .map((_, index) => {
        console.log(index);
        return campaign.methods.requests(index).call();
      })
  );

  console.log(requests);
  return {
    props: {
      requests: JSON.stringify(requests),
      contributorsCount,
      managerAddress,
      campaignAddress,
      requestsCount,
    },
  };
};

export default RequestsIndex;
