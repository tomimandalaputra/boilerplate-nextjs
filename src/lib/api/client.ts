import { env } from "@/config/env";
import type { ApiErrorBody, BaseResponse } from "@/types/responses/base-response-type";

// the single error type the whole app catches (and React Query types its `error` as)
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.errors = body.errors;
  }
}

type RequestInterceptor = (init: RequestInit) => RequestInit | Promise<RequestInit>;

// fetch has no interceptors — this is our own registry.
// runs for BOTH server prefetch and client calls (the whole reason it's here,
// not in a hook — a hook never runs during server rendering; PRD §10).
const requestInterceptors: RequestInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor): void {
  requestInterceptors.push(fn);
}

async function request<TData>(path: string, init: RequestInit = {}): Promise<TData> {
  let config: RequestInit = {
    ...init,
    headers: { "content-type": "application/json", ...init.headers },
  };

  // request interceptors (e.g. inject Authorization header)
  for (const intercept of requestInterceptors) {
    config = await intercept(config);
  }

  const res = await fetch(`${env.apiBaseUrl}${path}`, config);

  // response interceptor: normalize errors into one ApiError type
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(res.status, body ?? { success: false, message: res.statusText });
  }

  // response interceptor: unwrap the envelope so callers get TData, not BaseResponse<TData>
  const json = (await res.json()) as BaseResponse<TData>;
  return json.data;
}

export const apiClient = {
  get: <TData>(path: string) => request<TData>(path, { method: "GET" }),
  post: <TData>(path: string, body: unknown) =>
    request<TData>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <TData>(path: string, body: unknown) =>
    request<TData>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <TData>(path: string, body: unknown) =>
    request<TData>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <TData>(path: string) => request<TData>(path, { method: "DELETE" }),
};
