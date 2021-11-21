import react, { useState, useEffect } from 'react';
import countryList from './assets/country-code/country.json';
import languageList from './assets/country-code/lang.json';

import { G_Search } from './assets/apis/search';
import SearchItem from './components/searchItem';
import SearchBar from './components/searchBar';
import Footer from './components/footer';
import Home from './components/home';
function App() {
  const [countryDropdownStat, setCountryDropdownStat] = useState(false);
  const [filterCountryValue, setFilterCountryValue] = useState('');
  const [viewCountryList, setViewCountryList] = useState([]);
  const [SearchKeyInput, setSearchKeyInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('np');
  const [selectedLang, setSelectedLang] = useState('np');

  const [searchInformation, setSearchInformation] = useState({
    searchTime: 0,
    formattedSearchTime: '0',
    totalResults: '0',
    formattedTotalResults: '0',
  });
  const [SearchResultItems, setSearchResultItems] = useState([]);
  useEffect(() => {
    setViewCountryList(countryList);
  }, []);

  const handleClearSearch = () => {
    setSearchKeyInput('');
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
    console.log(getLang(country));
    G_Search(q, country, exactTerms, country).then(async (res) => {
      // console.log(res);
      // console.log(res.data.items);

      const items = res.data.items;
      await setSearchResultItems(items);
      await setSearchInformation(res.data.searchInformation);

      // console.log(SearchResultItems);
    });
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
        {SearchResultItems.length >= 1 ? (
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
      {!(SearchResultItems.length >= 1) ? (
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
            <a href='https://share.streamlit.io/rajivsingha/geo-serp-creator/main/geo_serp_streamlit_lite.py'> Rajiv</a>
          </p>
        </div>
      ) : null}
      {SearchResultItems.length >= 1 ? (
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
      {/* <div className='footer-box'>
        <Footer />
      </div> */}
    </div>
  );
}

export default App;
