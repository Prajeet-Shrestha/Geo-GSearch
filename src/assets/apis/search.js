export const G_Search = async (searchKey, country, exactTerms = '') => {
  const params = new URLSearchParams({ q: searchKey, country, exactTerms });
  const res = await fetch(`/api/search?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || 'Search failed');
    err.status = res.status;
    throw err;
  }
  return data;
};
