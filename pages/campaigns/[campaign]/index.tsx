import { GetStaticProps, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import getCampaign from "@ethereum/campaign";
import ContributeForm from "@components/ContributeForm";
import web3 from "@ethereum/web3";
import Link from "next/link";
import CampaignDetailsItem from "@components/CampaignDetailsItem";

type CampaignSummary = {
  minimumContribution: string;
  balance: string;
  requestsCount: string;
  contributorsCount: string;
  managerAddress: string;
  campaignAddress: string;
};

const CampaignDetails: FC<CampaignSummary> = (props) => {
  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 justify-items-center">
        <h3 className="my-4 font-bold float-left">Campaign Details</h3>
        <div></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CampaignDetailsItem
            value={`${props.balance} eth`}
            label="Campaign Balance"
          />
          <CampaignDetailsItem
            value={`${props.minimumContribution} wei`}
            label="Minimum Contribution"
          />
          <CampaignDetailsItem
            value={props.requestsCount}
            isLink
            href={`/campaigns/${props.campaignAddress}/requests`}
            label="Requests"
          />
          <CampaignDetailsItem
            value={props.contributorsCount}
            label="Contributors"
          />
          <CampaignDetailsItem value={props.managerAddress} label="Manager" />
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm  items-center">
            <p>{props.contributorsCount}</p>
            <p>Contributors</p>
          </div>
        </div>
        <ContributeForm
          campaignAddress={props.campaignAddress}
          minimumContribution={props.minimumContribution}
        />
      </div>
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
  const campaignSummary = await campaign.methods.getSummary().call();
  console.log(campaignSummary);

  return {
    props: {
      minimumContribution: campaignSummary[0],
      balance: web3.utils.fromWei(campaignSummary[1], "ether"),
      requestsCount: campaignSummary[2],
      contributorsCount: campaignSummary[3],
      managerAddress: campaignSummary[4],
      campaignAddress,
    },
  };
};

export default CampaignDetails;
