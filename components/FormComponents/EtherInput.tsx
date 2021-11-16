import { ChangeEvent, FC } from "react";

type Props = {
  inputChange: (input: string) => void;
  label: string;
  unit: string;
};

const EtherInput: FC<Props> = (props) => {
  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-2 relative rounded-md shadow-sm">
        <input
          type="number"
          step="any"
          name="min-contribution"
          id="min-contribution"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          onChange={(event) => {
            console.log(event.target.value);
            props.inputChange(event.target.value);
            // setRequestAmount(event.target.value);
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {props.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EtherInput;
