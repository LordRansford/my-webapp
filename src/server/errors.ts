export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly status: number;
  public readonly exposeMessage: string;
  public readonly cause?: unknown;

  constructor(params: { code: AppErrorCode; status: number; message: string; exposeMessage?: string; cause?: unknown }) {
    super(params.message);
    this.name = "AppError";
    this.code = params.code;
    this.status = params.status;
    this.exposeMessage = params.exposeMessage ?? "Request failed.";
    this.cause = params.cause;
  }
}

export function asAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  const message = err instanceof Error ? err.message : String(err);
  return new AppError({
    code: "INTERNAL_ERROR",
    status: 500,
    message,
    exposeMessage: "Something went wrong.",
    cause: err,
  });
}


