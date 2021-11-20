import react, { useState, useEffect } from 'react';
import countryList from './assets/country-code/country.json';
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

  const handleSearch = async (searchWords, country) => {
    const { q, exactTerms } = await parseSearchKeyWords(searchWords);
    G_Search(q, country, exactTerms).then(async (res) => {
      console.log(res.data.items);
      const items = res.data.items;
      await setSearchResultItems(items);
      await setSearchInformation(res.data.searchInformation);

      console.log(SearchResultItems);
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
  console.log(selectedCountry);
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
