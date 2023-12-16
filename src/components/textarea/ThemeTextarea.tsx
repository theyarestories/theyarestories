import classNames from "@/helpers/style/classNames";
import React, { ChangeEventHandler } from "react";
import ErrorMessage from "../alerts/ErrorMessage";

type Props = {
  label: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  name?: string;
  classname?: string;
  labelClassName?: string;
  error?: string;
};

function ThemeTextarea({
  label,
  value,
  onChange = () => {},
  name = "",
  classname = "",
  labelClassName = "",
  error,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="">
        <span className={classNames("", labelClassName)}>{label}</span>
        <textarea
          name={name}
          className={classNames("w-full border input", classname)}
          value={value}
          onChange={onChange}
        />
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default ThemeTextarea;
