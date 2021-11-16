import React, { FC } from "react";
import Head from "next/head";
import { getFactoryContract } from "../ethereum/campaignFactory";
import Link from "next/link";
import CampaignItem from "@components/CampaignItem";

type Campaign = {};

const Home: FC<{ campaigns: string[] }> = (props) => {
  return (
    <div>
      <Head>
        <title>Kickstart</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3 className="py-4">Open Campaigns</h3>
      <div>
        <div className="hidden md:block float-right h-screen">
          <Link href="/campaigns/new" passHref>
            <button
              type="button"
              className=" inline-flex items-center ml-12 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Campaign
            </button>
          </Link>
        </div>
        <div>
          <ul>
            {props.campaigns.map((address, index) => (
              <li key={index}>
                <CampaignItem address={address} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  let campaigns: string[] = [];
  const factory = await getFactoryContract();

  if (factory) {
    campaigns = await factory.methods.getDeployedCampaigns().call();
  }

  return {
    props: {
      campaigns,
    },
  };
}

export default Home;
