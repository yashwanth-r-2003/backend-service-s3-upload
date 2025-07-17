export const ERROR_RESPONSE_CODES = {
  400: {
    type: "invalid_request_error",
    message: "Invalid request. Please check your parameters.",
  },
  401: {
    type: "authentication_error",
    message: "Invalid authentication credentials.",
  },
  403: {
    type: "permission_error",
    message: "Permission denied. You don't have access to this resource.",
  },
  404: {
    type: "not_found_error",
    message: "The requested resource was not found.",
  },
  422: {
    type: "invalid_request_error",
    message: "Unprocessable entity. Invalid parameters provided.",
  },
  429: {
    type: "rate_limit_error",
    message: "Rate limit exceeded. Please try again later.",
  },
  500: {
    type: "api_error",
    message: "Internal server error. Please try again later.",
  },
  502: {
    type: "api_error",
    message: "Bad gateway. The upstream server returned an invalid response.",
  },
  503: {
    type: "api_error",
    message: "Service temporarily unavailable. Please try again later.",
  },
  504: {
    type: "api_error",
    message: "Gateway timeout. The request took too long to process.",
  },
};