import './sass/main.scss';
import { Notify } from 'notiflix';
import SearchAPIService from './searchAPI';
import picturesMarkup from './markup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

const searchAPI = new SearchAPIService();
let pageNum = 1;
let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.button.addEventListener('click', onButtonClick);

function onFormSubmit(e) {
  e.preventDefault();

  if (searchAPI.query !== e.currentTarget.elements.searchQuery.value) {
    clearMarkup();
  }

  searchAPI.query = e.currentTarget.elements.searchQuery.value;

  renderPictures();
  pageNum += 1;
}

function onButtonClick() {
  renderPictures();
  pageNum += 1;
}

async function renderPictures() {
  try {
    const data = await searchAPI.fetchPictures(pageNum);
    if (data.data.totalHits === 0) {
      failureNotification();
      return;
    }
    infoNotification(data);
    refs.gallery.insertAdjacentHTML('beforeend', picturesMarkup(data.data.hits));
    refs.button.removeAttribute('hidden');
    warningNotification(data);
  } catch (error) {
    console.log(error);
  }
  gallery.refresh();
  smoothScroll();
}

function failureNotification() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function warningNotification(data) {
  if (data.data.totalHits === refs.gallery.children.length) {
    refs.button.setAttribute('hidden', true);
    Notify.warning("We're sorry, but you've reached the end of search results.");
  }
}

function infoNotification(data) {
  if (refs.gallery.children.length === 0) {
    Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  }
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
  pageNum = 1;
  refs.button.setAttribute('hidden', true);
}

function smoothScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
