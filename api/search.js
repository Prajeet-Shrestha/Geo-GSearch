const CountryLanguage = require('country-language');

const SEARCH_API = process.env.GOOGLE_SEARCH_API || 'https://www.googleapis.com/customsearch/v1';

const deriveLang = (country) => {
  if (!country) return '';
  const code = country.toUpperCase();
  if (!CountryLanguage.countryCodeExists(code)) return '';
  const info = CountryLanguage.getCountry(code);
  return info?.languages?.[0]?.iso639_1 || country;
};

module.exports = async (req, res) => {
  const { q, country = '', exactTerms = '', start = '1' } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CX) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const startNum = Math.min(Math.max(parseInt(start, 10) || 1, 1), 91);

  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CX,
    q,
    safe: 'active',
    num: '10',
  });
  if (exactTerms) {
    params.set('exactTerms', exactTerms);
  }
  if (startNum > 1) {
    params.set('start', String(startNum));
  }
  if (country) {
    params.set('gl', country);
    params.set('cr', `country${country.toUpperCase()}`);
    const hl = deriveLang(country);
    if (hl) params.set('hl', hl);
  }

  try {
    const upstream = await fetch(`${SEARCH_API}?${params.toString()}`);
    let body;
    try {
      body = await upstream.json();
    } catch {
      body = {};
    }

    if (!upstream.ok) {
      const reason = body?.error?.errors?.[0]?.reason;
      const isQuota =
        upstream.status === 429 || reason === 'dailyLimitExceeded' || reason === 'rateLimitExceeded';
      return res.status(isQuota ? 429 : 502).json({ error: body?.error?.message || 'Search failed' });
    }

    return res.status(200).json(body);
  } catch (e) {
    return res.status(502).json({ error: 'Upstream request failed' });
  }
};
