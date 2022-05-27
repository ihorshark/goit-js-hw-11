import './sass/main.scss';
// import axios from 'axios';
import { Notify } from 'notiflix';
import SearchAPIService from './searchAPI';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
};

const searchAPI = new SearchAPIService();

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  searchAPI.query = e.currentTarget.elements.searchQuery.value;
  searchAPI.fetchPictures().then(data => {
    if (data.data.total === 0) {
      failureNotification();
      return;
    }
    console.log(data);
  });
}

function failureNotification() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}
