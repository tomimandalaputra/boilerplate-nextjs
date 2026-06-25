// The shared response envelope every endpoint returns (PRD §10.1).
// Domain types (User, etc.) live in their feature's `types.ts`, NOT here —
// only genuinely cross-cutting types belong in the global `types/`.

// the envelope every endpoint returns
export interface BaseResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
}

// payload shape for list endpoints
export interface PaginatedData<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
}

export type PaginatedResponse<TItem> = BaseResponse<PaginatedData<TItem>>;

// error body the api returns; the interceptor turns this into a thrown ApiError
export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // optional field-level validation errors
}
