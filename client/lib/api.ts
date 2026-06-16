import type { ApiError, AuthResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

type JsonBody = Record<string, string | undefined>;

export async function apiRequest(
  path: string,
  body: JsonBody,
  token?: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(
      Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined),
      ),
    ),
  });

  const payload = (await response.json()) as AuthResponse | ApiError;

  if (!response.ok) {
    const message =
      "errors" in payload && payload.errors?.length
        ? payload.errors.map((error) => error.message).join(", ")
        : payload.message;

    throw new Error(message || "Request failed");
  }

  return payload as AuthResponse;
}
