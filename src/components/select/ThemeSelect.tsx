import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import classNames from "@/helpers/style/classNames";
import useIsRtl from "@/hooks/useIsRtl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type Option<CustomOption> = { name: string } & CustomOption;

type Props<CustomOption> = {
  options: Option<CustomOption>[];
  selected: Option<CustomOption> | null;
  handleChange(option: Option<CustomOption>): void;
  className?: string;
  withOptionTick?: boolean;
  placeholder?: string;
  withUnderline?: boolean;
};

export default function ThemeSelect<CustomOption>({
  options,
  selected,
  handleChange,
  className = "",
  withOptionTick = true,
  placeholder = "",
  withUnderline = false,
}: Props<CustomOption>) {
  const isRtl = useIsRtl();

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className={classNames("relative", className)}>
        <Listbox.Button
          className={classNames(
            "relative w-full cursor-pointer p-2 text-start pe-6",
            withUnderline ? "" : "input"
          )}
        >
          <span className="block truncate">
            {selected ? selected.name : placeholder}
          </span>
          <span
            className={classNames(
              "pointer-events-none absolute inset-y-0 flex items-center",
              isRtl ? "left-0" : "right-0"
            )}
          >
            <ChevronDownIcon
              className="h-4 w-4 text-gray-600"
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
          {/* w-full */}
          <Listbox.Options
            className={classNames(
              "absolute z-10 mt-1 max-h-60 overflow-auto rounded-sm bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none",
              isRtl ? "left-0" : "right-0"
            )}
          >
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pe-4",
                    withOptionTick ? "ps-10" : "ps-4",
                    active ? "bg-green-100 text-green-900" : "text-gray-900"
                  )
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-medium" : "font-normal"
                      )}
                    >
                      {option.name}
                    </span>
                    {selected && withOptionTick ? (
                      <span
                        className={classNames(
                          "absolute inset-y-0 flex items-center ps-3 text-green-600",
                          isRtl ? "right-0" : "left-0"
                        )}
                      >
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
