import React from 'react';
import system from '../assets/images/system.png';

export default function Error({ isQuoteFull }) {
  return (
    <div className='error-page'>
      <div>
        <h1>Geo G-Search</h1>
        <p>
          <strong>404.</strong> That's an error.
        </p>
        <p className='body'>
          {isQuoteFull
            ? "The service has reached today's max threshold. Please try again in 24 hours."
            : "The service is currently offline.That's all we know."}
        </p>
        <p className='footerNote'>
          Reach out to <a href='https://prajeetshrestha.com.np/'>Prajeet</a>. If it keeps on happening.
        </p>
      </div>
      <img src={system} />
    </div>
  );
}
