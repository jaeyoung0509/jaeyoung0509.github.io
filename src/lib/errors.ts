export function errorMessage(error: unknown, fallback = "요청을 처리하지 못했습니다."): string {
  return error instanceof Error ? error.message : fallback;
}

export function errorStatus(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error && typeof error.status === "number") {
    return error.status;
  }
  return 500;
}
