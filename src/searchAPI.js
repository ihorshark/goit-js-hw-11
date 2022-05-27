import axios from 'axios';
import { Notify } from 'notiflix';

export default class SearchAPIService {
  constructor() {
    this.searchQuery = '';
  }

  fetchPictures() {
    const BASE_URL = 'https://pixabay.com/api/';

    const options = {
      params: {
        key: '27689909-7d1690a50f11c45e1b62c3fca',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };

    return axios.get(BASE_URL, options);
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
