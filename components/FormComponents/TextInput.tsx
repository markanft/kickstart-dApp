import { FC } from "react";

type Props = {
  label: string;
  inputChange: (input: string) => void;
};

const TextInput: FC<Props> = (props) => {
  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="request-description"
          id="request-description"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onChange={(event) => {
            props.inputChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default TextInput;
