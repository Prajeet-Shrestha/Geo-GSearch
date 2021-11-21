import axios from 'axios';
import { uule } from 'uule';
var CountryLanguage = require('country-language');

export const G_Search = async (searchKey, country, exactTerms = '', lang = '') => {
  var countryExists = await CountryLanguage.countryCodeExists(country.toUpperCase());
  var languages = '';
  if (countryExists) {
    const res = await CountryLanguage.getCountry(country.toUpperCase());
    console.log(res.languages);
    languages = res.languages[0].iso639_1 ? res.languages[0].iso639_1 : country;
  }
  let url = `${process.env.REACT_APP_SEARCH_API}?key=${process.env.REACT_APP_API_KEY}&uule=${
    uule(country) != undefined ? uule(country) : ''
  }&safe=active&cx=${process.env.REACT_APP_PSI}&q=${searchKey}&exactTerms=${
    exactTerms.length >= 1 ? exactTerms : searchKey
  }&gl=${country}&num=10&hl=${languages}&cr=country${country.toUpperCase()}`;
  return axios.get(url);
};

// &lr=lang_${lang}
