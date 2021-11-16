import Link from "next/link";
import { FC } from "react";

type Props = {
  address: string;
};
const CampaignItem: FC<Props> = (props) => {
  return (
    <div className="relative my-2 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {props.address}
        </p>
        <p className="text-sm text-gray-500 truncate">
          <Link href={`/campaigns/${props.address}`}>
            <a href="#">View Campaign</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CampaignItem;
