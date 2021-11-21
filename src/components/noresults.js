import React from 'react';
import ghost from '../assets/images/ghost_color.png';

export default function NoResults({ searchKey }) {
  return (
    <div className='search-noResult'>
      <img src={ghost} />

      <div>
        <h2>You found a ghost!</h2>
        <p>
          Your search -<span> {searchKey} </span> - did not match any documents.
        </p>
        <p className='suggestion-title'>Suggestion</p>

        <ul>
          <li>The content you are searching probably doesn't come from the country you selected.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords.</li>
        </ul>
      </div>
    </div>
  );
}
