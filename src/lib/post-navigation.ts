export function postHref(slug: string, listUrl: URL): string {
  const params = new URLSearchParams();
  for (const key of ["q", "tag"]) {
    const value = listUrl.searchParams.get(key);
    if (value) params.set(key, value);
  }
  if (listUrl.pathname === "/blog/") params.set("index", "blog");
  return `/blog/${slug}/${params.size ? `?${params}` : ""}`;
}

export function writingHref(articleUrl: URL): string {
  const params = new URLSearchParams();
  for (const key of ["q", "tag"]) {
    const value = articleUrl.searchParams.get(key);
    if (value) params.set(key, value);
  }
  const path = articleUrl.searchParams.get("index") === "blog" ? "/blog/" : "/";
  return `${path}${params.size ? `?${params}` : ""}`;
}
