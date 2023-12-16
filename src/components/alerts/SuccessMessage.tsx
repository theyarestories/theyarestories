"use-client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  message: string;
};

function SuccessMessage({ message }: Props) {
  return (
    <p className="flex items-center gap-x-1 rounded-md bg-green-100 px-2 py-1 text-sm text-green-900">
      <CheckCircleIcon className="w-4 shrink-0" />
      {message}
    </p>
  );
}

export default SuccessMessage;
