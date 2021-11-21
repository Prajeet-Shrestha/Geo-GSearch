import react, { useState, useEffect } from 'react';
import countryList from './assets/country-code/country.json';
import languageList from './assets/country-code/lang.json';

import { G_Search } from './assets/apis/search';
import SearchItem from './components/searchItem';
import SearchBar from './components/searchBar';
import Footer from './components/footer';
import Home from './components/home';
import NoResults from './components/noresults';
import Error from './components/error';

function App() {
  const [countryDropdownStat, setCountryDropdownStat] = useState(false);
  const [viewCountryList, setViewCountryList] = useState([]);
  const [SearchKeyInput, setSearchKeyInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('np');
  const [HasResults, setHasResults] = useState(false);
  const [isSearchPage, setSearchPage] = useState(false);
  const [isHomePage, setHomePage] = useState(true);
  const [error, setError] = useState(false);
  const [isQuoteFull, setIsQuoteFull] = useState(false);

  const [searchWord, setSearchWord] = useState('');
  const [searchInformation, setSearchInformation] = useState({
    searchTime: 0,
    formattedSearchTime: '0',
    totalResults: '0',
    formattedTotalResults: '0',
  });
  const [SearchResultItems, setSearchResultItems] = useState([]);
  useEffect(() => {
    setViewCountryList(countryList);
    var queryParams = new URLSearchParams(window.location.search);
    const key = queryParams.get('key');
    const country = queryParams.get('country');
    if (key && country) {
      setSearchKeyInput(key);
      setSelectedCountry(country);
      handleSearch(key, country);
    }
  }, []);

  const handleClearSearch = () => {
    setSearchKeyInput('');
    toggleHomePage(true);
    window.history.pushState({}, document.title, '/');
  };

  const parseSearchKeyWords = (value) => {
    const regex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
    let exactTerms = value.match(regex);
    return {
      q: value,
      exactTerms: exactTerms ? exactTerms[0] : '',
    };
  };

  const getLang = (country) => {
    let res = languageList.filter((data) => data.lang.toLowerCase().includes(country.toLowerCase()));
    if (res.length >= 1) {
      return res[0];
    } else {
      return false;
    }
  };

  const handleSearch = async (searchWords, country) => {
    const { q, exactTerms } = await parseSearchKeyWords(searchWords);

    var queryParams = new URLSearchParams(window.location.search);

    G_Search(q, country, exactTerms, country)
      .then(async (res) => {
        queryParams.set('key', q);
        queryParams.set('country', country);
        window.history.pushState(null, null, '?' + queryParams.toString());
        setSearchWord(q);
        console.log(res);
        // console.log(res.data.items);

        const items = res.data.items;
        if (items) {
          setHasResults(true);
        } else {
          setHasResults(false);
        }
        toggleSearchPage(true);
        await setSearchResultItems(items ? items : []);
        await setSearchInformation(res.data.searchInformation);

        // console.log(SearchResultItems);
      })
      .catch((err) => {
        setIsQuoteFull(true);
        setError(true);
        setHasResults(false);
        toggleSearchPage(true);
        queryParams.set('key', q);
        queryParams.set('country', country);
        window.history.pushState(null, null, '?' + queryParams.toString());
      });
  };
  const toggleSearchPage = (bool) => {
    setHomePage(!bool);
    setSearchPage(bool);
  };
  const toggleHomePage = (bool) => {
    setHomePage(bool);
    setSearchPage(!bool);
  };
  const handleFilterCountry = async (value) => {
    let filter = await countryList.filter((data) => data.Country.toLowerCase().includes(value.toLowerCase()));
    setViewCountryList(filter);
  };
  const handleSelectCountry = (value) => {
    setSelectedCountry(value);
    setCountryDropdownStat(false);
  };
  return (
    <div className='App'>
      <div className='top'>
        {isSearchPage ? (
          <SearchBar
            setCountryDropdownStat={setCountryDropdownStat}
            countryDropdownStat={countryDropdownStat}
            selectedCountry={selectedCountry}
            handleFilterCountry={handleFilterCountry}
            setSearchKeyInput={setSearchKeyInput}
            handleSearch={handleSearch}
            SearchKeyInput={SearchKeyInput}
            setSearchResultItems={setSearchResultItems}
            viewCountryList={viewCountryList}
            handleSelectCountry={handleSelectCountry}
            handleClearSearch={handleClearSearch}
          />
        ) : null}
      </div>
      {isHomePage ? (
        <div className='initial-home'>
          <Home />
          <SearchBar
            setCountryDropdownStat={setCountryDropdownStat}
            countryDropdownStat={countryDropdownStat}
            selectedCountry={selectedCountry}
            handleFilterCountry={handleFilterCountry}
            setSearchKeyInput={setSearchKeyInput}
            handleSearch={handleSearch}
            SearchKeyInput={SearchKeyInput}
            setSearchResultItems={setSearchResultItems}
            viewCountryList={viewCountryList}
            handleSelectCountry={handleSelectCountry}
            handleClearSearch={handleClearSearch}
          />
          <p className='footerNote'>
            Created and designed by <a href='https://prajeetshrestha.com.np/'>Prajeet</a>
          </p>
          <p className='InspireNote'>
            Inspired by <a href='https://www.google.com/advanced_search'>Google Advance Search</a> {'&'}
            <a href='https://share.streamlit.io/rajivsingha/geo-serp-creator/main/geo_serp_streamlit_lite.py'>
              {' '}
              Rajiv
            </a>{' '}
            . Hosted on <a href='https://vercel.com/'>Vercel</a>
          </p>
        </div>
      ) : null}
      {isSearchPage && HasResults && !error ? (
        <div className='search-result'>
          <p id='result-number'>
            About {searchInformation.formattedTotalResults} results ({searchInformation.formattedSearchTime} seconds){' '}
          </p>
          {SearchResultItems.map((data, index) => (
            <SearchItem
              title={data.title}
              formattedUrl={data.formattedUrl}
              link={data.link}
              htmlSnippet={data.htmlSnippet}
              snippet={data.snippet}
            />
          ))}
        </div>
      ) : null}
      {isSearchPage && !HasResults && !error ? (
        <div className='search-result'>
          <p id='result-number'>
            About {searchInformation.formattedTotalResults} results ({searchInformation.formattedSearchTime} seconds){' '}
          </p>
          <NoResults searchKey={searchWord} />
        </div>
      ) : null}
      {isSearchPage && !HasResults && error ? (
        <div className='search-result'>
          <Error isQuoteFull={isQuoteFull} />
        </div>
      ) : null}
      {/* <div className='footer-box'>
        <Footer />
      </div> */}
    </div>
  );
}

export default App;
