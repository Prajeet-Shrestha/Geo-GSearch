import React from 'react';

export default function Footer({ currentPage, totalPages, hasNextPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages || !hasNextPage;

  return (
    <div className='page-bar'>
      <ul className='page-list'>
        <li>
          <button
            type='button'
            className='page-list-previous'
            disabled={isFirst}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              type='button'
              className={`page-list-number${page === currentPage ? ' active' : ''}`}
              disabled={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            type='button'
            className='page-list-next'
            disabled={isLast}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
}
