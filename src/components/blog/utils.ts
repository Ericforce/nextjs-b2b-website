export type BlogSearchParams = Record<string, string | string[] | undefined>;

function appendSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | string[]
) {
  if (Array.isArray(value)) {
    params.delete(key);
    value.forEach((entry) => {
      if (entry) {
        params.append(key, entry);
      }
    });
    return;
  }

  if (value) {
    params.set(key, value);
  }
}

export function buildBlogUrl(
  basePath: string,
  currentParams: BlogSearchParams,
  updates: Record<string, string | null | undefined>
): string {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    appendSearchParam(params, key, value);
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  return query.length > 0 ? `${basePath}?${query}` : basePath;
}

export function getParamValue(
  value: string | string[] | undefined
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
