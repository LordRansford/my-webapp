export type ToolOk<T> = { ok: true; data: T };
export type ToolErr = {
  ok: false;
  kind: "network" | "server" | "bad_response" | "aborted";
  status?: number;
};

export type ToolResult<T> = ToolOk<T> | ToolErr;


