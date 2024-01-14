// Handling Axios errors => https://axios-http.com/docs/handling_errors

import { ApiError } from "@/interfaces/api-client/Error";
import { H } from "@highlight-run/next/client";
import { HttpStatusCode } from "axios";
import { isBrowser } from "browser-or-node";
import { Err, err } from "neverthrow";

export default function handleApiError<TResponse>(
  error: any,
  metadata?: { [key: string]: string; path: string }
): Err<TResponse, ApiError> {
  const ignoredErrors = [
    metadata?.path === "/api/auth/get-user-by-token" &&
      error?.response?.status === HttpStatusCode.Unauthorized,
  ];

  if (isBrowser && !ignoredErrors.some(Boolean)) {
    H.consumeError(error, error.message, metadata);
  }
  return err({
    errorMessage: error?.message,
    errorStatus: error?.response?.status,
    errorResponse: error?.response?.data,
    errorMetadata: metadata,
  });
}
