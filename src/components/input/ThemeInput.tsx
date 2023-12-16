import classNames from "@/helpers/style/classNames";
import React, { ChangeEventHandler, FocusEventHandler, useState } from "react";
import ErrorMessage from "../alerts/ErrorMessage";

type Props = {
  type: string;
  label: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  classname?: string;
  labelClassName?: string;
  error?: string;
};

function ThemeInput({
  type,
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
        <input
          name={name}
          className={classNames("w-full border input", classname)}
          value={value}
          onChange={onChange}
          type={type}
        />
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default ThemeInput;
