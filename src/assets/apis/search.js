export const G_Search = async (searchKey, country, exactTerms = '', start = 1) => {
  const params = new URLSearchParams({ q: searchKey, country, exactTerms, start });
  const res = await fetch(`/api/search?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || 'Search failed');
    err.status = res.status;
    throw err;
  }
  return data;
};
