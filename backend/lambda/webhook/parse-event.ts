export interface LambdaHttpEvent {
  version?: string;
  rawPath?: string;
  rawQueryString?: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  body?: string | null;
  isBase64Encoded?: boolean;
  requestContext?: {
    http?: {
      method?: string;
      path?: string;
    };
  };
}

function getHeader(
  headers: Record<string, string | undefined> | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined;
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower && value) return value;
  }
  return undefined;
}

export function getHttpMethod(event: LambdaHttpEvent): string {
  return (
    event.requestContext?.http?.method ??
    (event as { httpMethod?: string }).httpMethod ??
    "GET"
  ).toUpperCase();
}

export function getQueryParam(
  event: LambdaHttpEvent,
  name: string,
): string | undefined {
  const fromMap = event.queryStringParameters?.[name];
  if (fromMap) return fromMap;

  const raw = event.rawQueryString ?? "";
  if (!raw) return undefined;

  const params = new URLSearchParams(raw);
  return params.get(name) ?? undefined;
}

export function getWebhookSecretHeader(
  event: LambdaHttpEvent,
): string | undefined {
  return getHeader(event.headers, "x-webhook-secret");
}

export function parseRequestBody(event: LambdaHttpEvent): unknown {
  let body = event.body ?? "";
  if (!body) return {};

  if (event.isBase64Encoded) {
    body = Buffer.from(body, "base64").toString("utf8");
  }

  const contentType = getHeader(event.headers, "content-type") ?? "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(body);
    const record: Record<string, string> = {};
    for (const [key, value] of params) {
      record[key] = value;
    }
    return record;
  }

  const trimmed = body.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return body;
    }
  }

  return body;
}
