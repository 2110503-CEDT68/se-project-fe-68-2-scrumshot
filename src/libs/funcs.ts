import { APIResponseError } from "./types";

// Thx gemini
/**
 * A generic wrapper for the Fetch API that handles error parsing
 * and guarantees a consistent return type.
 */
export async function fetchWrapper<T>(
  url: string,
  options?: RequestInit
): Promise<T | APIResponseError> {
  try {
    const response = await fetch(url, {
      ...options,
    });
    const data = await response.json();

    if (!response.ok) {
      // Assuming your backend sends back the APIResponseError structure on failure
      return data as APIResponseError; 
    }

    return data as T;
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected network error occurred"
    };
  }
}