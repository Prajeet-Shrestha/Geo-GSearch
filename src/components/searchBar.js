import React from 'react';

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
  return (
    <div className='sr-search-bar'>
      <span className='country dropdown'>
        <img
          onClick={() => {
            setCountryDropdownStat(countryDropdownStat ? false : true);
          }}
          className='dropbtn'
          src={`https://flagcdn.com/${selectedCountry}.svg`}
          width='16px'
          alt='country'
        />
        <div
          className='dropdown-content'
          style={{
            display: `${countryDropdownStat ? 'block' : 'none'}`,
          }}
        >
          <input
            autocomplete='false'
            onChange={(e) => {
              handleFilterCountry(e.target.value);
            }}
            className='country-filter'
            placeholder='Filter country'
          />
          <div className='list-items'>
            {viewCountryList.map((data, index) => (
              <a
                onClick={() => {
                  handleSelectCountry(data.Code);
                }}
              >
                {data.Country}
              </a>
            ))}
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
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z'
              fill='black'
              fill-opacity='0.8'
            />
          </svg>
        }
      </span>
    </div>
  );
}
