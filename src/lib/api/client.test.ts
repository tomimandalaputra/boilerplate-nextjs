import { describe, it, expect, vi, afterEach } from "vitest";
import { apiClient, ApiError, addRequestInterceptor } from "@/lib/api/client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiClient", () => {
  it("unwraps BaseResponse<T> so callers receive T (PRD §10.2)", async () => {
    const payload = [{ id: "1", name: "Jane", email: "jane@example.com" }];
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ success: true, message: "ok", data: payload }));

    const data = await apiClient.get<typeof payload>("/users");

    expect(data).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("throws a typed ApiError carrying field errors on a non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        {
          success: false,
          message: "Validation failed",
          errors: { email: ["Email already taken"] },
        },
        422,
      ),
    );

    const error = await apiClient.get("/users").catch((e: unknown) => e as ApiError);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(422);
    expect((error as ApiError).errors?.email?.[0]).toBe("Email already taken");
  });

  it("runs registered request interceptors on every call (auth header)", async () => {
    addRequestInterceptor((init) => ({
      ...init,
      headers: { ...init.headers, authorization: "Bearer test-token" },
    }));

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ success: true, message: "ok", data: null }));

    await apiClient.get("/users");

    const init = fetchMock.mock.calls[0]?.[1];
    const headers = init?.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer test-token");
  });
});
