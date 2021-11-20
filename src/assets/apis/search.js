import axios from 'axios';

export const G_Search = (searchKey, country, exactTerms = '') => {
  return axios.get(
    `${process.env.REACT_APP_SEARCH_API}?key=${process.env.REACT_APP_API_KEY}&cx=${process.env.REACT_APP_PSI}&q=${searchKey}&exactTerms=${exactTerms}&gl=${country}`
  );
};
