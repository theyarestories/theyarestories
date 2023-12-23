import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";

type Option<CustomOption> = { name: string } & CustomOption;

type Props<CustomOption> = {
  options: Option<CustomOption>[];
  selected: Option<CustomOption>;
  handleChange: Dispatch<SetStateAction<Option<CustomOption>>>;
};

export default function ThemeSelect<CustomOption>({
  options,
  selected,
  handleChange,
}: Props<CustomOption>) {
  const isRtl = useIsRtl();

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative mt-1">
        {/* {label && (
          <Listbox.Label className={labelClassName}>{label}:</Listbox.Label>
        )} */}
        {/* rounded-lg bg-white py-2 pl-3 pr-10 text-left sm:text-sm shadow-md */}
        <Listbox.Button
          className={classNames(
            "relative w-full input cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-start"
          )}
        >
          <span className="block truncate">{selected.name}</span>
          <span
            className={classNames(
              "pointer-events-none absolute inset-y-0 flex items-center pe-2",
              isRtl ? "left-0" : "right-0"
            )}
          >
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
