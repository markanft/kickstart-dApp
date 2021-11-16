import { FC } from "react";

type Props = {
  disabled: boolean;
  loading: boolean;
  text: string;
};
const SumbitButton: FC<Props> = (props) => {
  return (
    <button
      disabled={props.disabled}
      type="submit"
      className={
        !props.disabled && !props.loading
          ? "mt-10 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          : "inline-flex bg-blue-500 text-white font-bold mt-10 items-center px-4 py-2 rounded opacity-50 cursor-not-allowed"
      }
    >
      {props.text}
      {props.loading && (
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
  );
};

export default SumbitButton;
