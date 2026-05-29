import React, { useState, useEffect, useRef } from 'react';

export default function SearchBar({
  setCountryDropdownStat,
  countryDropdownStat,
  selectedCountry,
  handleFilterCountry,
  viewCountryList,
  handleSelectCountry,
  handleClearSearch,
  SearchKeyInput,
  setSearchKeyInput,
  handleSearch,
  setSearchResultItems,
}) {
  const [Focus, setFocus] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef(null);
  const filterInputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    document.getElementById('searchBox').addEventListener('focusin', function () {
      setFocus(true);
    });
    document.getElementById('searchBox').addEventListener('focusout', function () {
      setFocus(false);
    });
  }, []);

  const closeDropdown = () => {
    setCountryDropdownStat(false);
    setFilterText('');
    handleFilterCountry('');
  };

  const selectCountry = (code) => {
    handleSelectCountry(code);
    setFilterText('');
    handleFilterCountry('');
  };

  useEffect(() => {
    if (!countryDropdownStat) return;
    const selected = viewCountryList.findIndex((c) => c.Code === selectedCountry);
    setActiveIndex(selected >= 0 ? selected : 0);
    const id = window.setTimeout(() => filterInputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryDropdownStat]);

  useEffect(() => {
    if (!countryDropdownStat) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryDropdownStat]);

  useEffect(() => {
    const node = listRef.current?.children?.[activeIndex];
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleFilterKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, viewCountryList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const country = viewCountryList[activeIndex];
      if (country) selectCountry(country.Code);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  return (
    <div className='sr-search-bar' style={{ boxShadow: `${Focus ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : ''}` }}>
      <span className='country dropdown' ref={dropdownRef}>
        <span
          className={`dropbtn${countryDropdownStat ? ' open' : ''}`}
          onClick={() => {
            if (countryDropdownStat) {
              closeDropdown();
            } else {
              setCountryDropdownStat(true);
            }
          }}
        >
          <img
            className='flag'
            src={`https://flagcdn.com/${selectedCountry}.svg`}
            width='16px'
            alt='country'
            loading='lazy'
          />
          <svg className='chevron' width='10' height='10' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'>
            <path d='M2 4L6 8L10 4' stroke='rgba(0,0,0,0.5)' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </span>
        <div
          className='dropdown-content'
          style={{
            display: `${countryDropdownStat ? 'block' : 'none'}`,
          }}
        >
          <div className='filter-wrap'>
            <svg className='search-icon' width='14' height='14' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z'
                fill='rgba(0,0,0,0.4)'
              />
            </svg>
            <input
              ref={filterInputRef}
              autoComplete='off'
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                handleFilterCountry(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleFilterKeyDown}
              className='country-filter'
              placeholder='Filter country'
            />
          </div>
          <div className='list-items' role='listbox' ref={listRef}>
            {viewCountryList.length === 0 ? (
              <p className='no-results'>No countries found</p>
            ) : (
              viewCountryList.map((data, index) => {
                const isSelected = data.Code === selectedCountry;
                const isActive = index === activeIndex;
                return (
                  <button
                    type='button'
                    role='option'
                    aria-selected={isSelected}
                    className={`country-option${isSelected ? ' is-selected' : ''}${isActive ? ' is-active' : ''}`}
                    key={data.Code ?? index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      selectCountry(data.Code);
                    }}
                  >
                    <img className='flag' src={`https://flagcdn.com/${data.Code}.svg`} width='18' alt='' loading='lazy' />
                    <span className='name'>{data.Country}</span>
                    {isSelected ? (
                      <svg className='check' width='16' height='16' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' fill='currentColor' />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </span>

      <div className='vLine'></div>
      <span className='textBox'>
        <input
          autocomplete='off'
          type='text'
          name=''
          id='searchBox'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && SearchKeyInput.length >= 1) {
              handleSearch(SearchKeyInput, selectedCountry);
            } else if (e.key === 'Enter') {
              setSearchResultItems([]);
            }
          }}
          value={SearchKeyInput}
          onChange={(e) => {
            setSearchKeyInput(e.target.value);
          }}
        />
      </span>
      {SearchKeyInput.length >= 1 ? (
        <span
          className='cancelBtn'
          onClick={() => {
            handleClearSearch();
          }}
        >
          {
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'
                fill='black'
                fill-opacity='0.6'
              />
            </svg>
          }
        </span>
      ) : null}

      <div className='vLine'></div>
      <span
        className='searchBtn'
        onClick={() => {
          if (SearchKeyInput.length >= 1) {
            handleSearch(SearchKeyInput, selectedCountry);
          } else {
            setSearchResultItems([]);
          }
        }}
      >
        {
          <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z'
              fill-opacity='0.8'
            />
          </svg>
        }
      </span>
    </div>
  );
}
