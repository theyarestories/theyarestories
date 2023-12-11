import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  message: string;
};

function ErrorMessage({ message }: Props) {
  return (
    <p className="flex items-center gap-x-1 rounded-md bg-red-100 px-2 py-1 text-sm text-red-700">
      <ExclamationCircleIcon className="w-6 shrink-0" />
      {message}
    </p>
  );
}

export default ErrorMessage;
