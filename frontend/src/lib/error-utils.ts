import { AxiosError } from "axios";

/**
 * Extracts a human-readable error message from an API error.
 * Prioritizes backend-provided messages, then status-based ones, then fallbacks.
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!(error instanceof AxiosError)) {
    if (error instanceof Error) return error.message;
    return fallback;
  }

  const data = error.response?.data;
  const status = error.response?.status;

  // 1. Priority: Backend provided message
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  // 2. Secondary: Status code mapping for Auth/Common errors
  switch (status) {
    case 400:
      return "Invalid request. Please check your information.";
    case 401:
      return "Invalid email or password. Please try again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 409:
      return "This account already exists. Try signing in instead.";
    case 422:
      return "The information provided is invalid.";
    case 429:
      return "Too many requests. Please slow down and try later.";
    case 500:
      return "Our server is having a moment. Please try again in a few minutes.";
    default:
      return fallback;
  }
}
