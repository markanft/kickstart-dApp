import Link from "next/link";
import React, { FC } from "react";

type Props = {
  value: string;
  label: string;
  isLink?: boolean;
  href?: string;
};

const CampaignDetailsItem: FC<Props> = (props) => {
  return (
    <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm  items-center">
      <p className="truncate">{props.value}</p>
      {props.isLink && (
        <Link href={props.href ? props.href : ""}>
          <a className="text-blue-600">{props.label}</a>
        </Link>
      )}
      {!props.isLink && <p>{props.label}</p>}
    </div>
  );
};

export default CampaignDetailsItem;
