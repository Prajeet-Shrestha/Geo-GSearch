import React from 'react';

export default function SearchItem({ title, link, htmlSnippet, snippet, formattedUrl }) {
  const formatUrl = (url) => {
    let format1 = url.replace('https://', '');
    let format2 = format1.replace('http://', '');
    let format3 = format2.split('/');
    let elem = [];
    format3.map((data, index) => {
      let e = null;
      if (data != null) {
        e = (
          <div className={`link-url url-${index}`}>
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
    <div class='search-item'>
      <a className='href-link' href={link}>
        <a>{formatUrl(formattedUrl)} </a>
        <h2>{title} </h2>
      </a>

      <p dangerouslySetInnerHTML={{ __html: htmlSnippet }}></p>
    </div>
  );
}
