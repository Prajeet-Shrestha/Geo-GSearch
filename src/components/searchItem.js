import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const isHttpUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url);

const getThumbnailCandidates = (pagemap) => {
  if (!pagemap) return [];
  const candidates = [
    pagemap.metatags?.[0]?.['og:image'],
    pagemap.metatags?.[0]?.['twitter:image'],
    pagemap.cse_thumbnail?.[0]?.src,
    pagemap.cse_image?.[0]?.src,
  ];
  return [...new Set(candidates.filter(isHttpUrl))];
};

const getFaviconUrl = (link) => {
  if (!isHttpUrl(link)) return null;
  try {
    const { hostname } = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`;
  } catch {
    return null;
  }
};

export default function SearchItem({ title, link, htmlSnippet, snippet, formattedUrl, pagemap }) {
  const [thumbIndex, setThumbIndex] = useState(0);
  const [faviconError, setFaviconError] = useState(false);
  const thumbs = getThumbnailCandidates(pagemap);
  const thumb = thumbs[thumbIndex] ?? null;
  const faviconUrl = getFaviconUrl(link);

  const formatUrl = (url) => {
    let format1 = url.replace('https://', '');
    let format2 = format1.replace('http://', '');
    let format3 = format2.split('/');
    let elem = [];
    format3.map((data, index) => {
      let e = null;
      if (data != null) {
        e = (
          <div key={index} className={`link-url url-${index}`}>
            <div>{`${index == 0 ? 'https://' : ''}${data}`}</div>
            {index != format3.length - 1 ? (
              <svg xmlns='http://www.w3.org/2000/svg' height='14px' viewBox='0 0 24 24' width='14px' fill='#5f6368'>
                <path d='M0 0h24v24H0z' fill='none' />
                <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' />
              </svg>
            ) : (
              ''
            )}
          </div>
        );
      }

      elem.push(e);
    });
    return elem;
  };

  return (
    <div className='search-item'>
      <div className='search-item-text'>
        <a className='href-link' href={link}>
          <a>
            {faviconUrl && !faviconError ? (
              <img
                className='search-item-favicon'
                src={faviconUrl}
                alt=''
                width='16'
                height='16'
                loading='lazy'
                onError={() => setFaviconError(true)}
              />
            ) : null}
            {formatUrl(formattedUrl)}{' '}
          </a>
          <h2>{title} </h2>
        </a>

        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlSnippet) }}></p>
      </div>

      {thumb ? (
        <a className='search-item-thumb' href={link} tabIndex={-1} aria-hidden='true'>
          <img
            key={thumb}
            src={thumb}
            alt=''
            loading='lazy'
            onError={() => setThumbIndex((i) => i + 1)}
          />
        </a>
      ) : null}
    </div>
  );
}
