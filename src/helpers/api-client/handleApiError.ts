// Handling Axios errors => https://axios-http.com/docs/handling_errors

import { ApiError } from "@/interfaces/api-client/Error";
import { Err, err } from "neverthrow";
import consumeError from "../highlight/consumeError";

export default function handleApiError<TResponse>(
  error: any,
  metadata?: { [key: string]: string }
): Err<TResponse, ApiError> {
  consumeError(error, metadata);
  return err({
    errorMessage: error?.message,
    errorStatus: error?.response?.status,
    errorResponse: error?.response?.data,
    errorMetadata: metadata,
  });
}
