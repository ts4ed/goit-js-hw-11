import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './js/fetch';

const refs = {
  form: document.querySelector('#search-form'),
  galleryMarkup: document.querySelector('.gallery__list'),
  loadMore: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});

const limit = 40;
const totalPages = 500 / limit;
let name = '';
let page = 1;

Notiflix.Notify.init({
  position: 'right-top',
  width: '400px',
  fontSize: '25px',
});

refs.form.addEventListener('submit', search);
refs.loadMore.addEventListener('click', loadMore);

function search(evn) {
  evn.preventDefault();
  const { searchQuery } = evn.currentTarget;
  name = searchQuery.value.toLowerCase().trim();
  clearInput();
  if (name === '') {
    refs.loadMore.classList.add('is-hidden');
    Notiflix.Notify.warning('Please enter request.');
    return;
  }
  imagesFetch(name);

  evn.currentTarget.reset();
  
}
function loadMore() {
  const params = new URLSearchParams({
    page: page,
    per_page: limit,
  });
  const key = `key=27923124-abae4833d2be49fca3c02a38e`;
  const paramSerch = `image_type=photo&orientation=horizontal&safesearch=true`;
  const url = `https://pixabay.com/api/?${key}&q=${name}&${params}&${paramSerch}`;

  
  if (page > totalPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(pictures => {
      addMarkupItems(pictures.hits);
       page += 1;
       if (pictures.hits.length < limit) {
         refs.loadMore.classList.add('is-hidden');
         return;
       }
    });
  
}

function imagesFetch(name) {
  fetchImages(name)
    .then(pictures => {
      if (pictures.total === 0) {
        refs.loadMore.classList.add('is-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      
      refs.loadMore.classList.remove('is-hidden');
      Notiflix.Notify.info(`Hooray! We found ${pictures.total} images.`);
      addMarkupItems(pictures.hits);
      page +=1
      if (pictures.hits.length < limit) {
        refs.loadMore.classList.add('is-hidden');
      }
    })
    .catch(error => console.log(error));
}

function clearInput() {
  refs.galleryMarkup.innerHTML = '';
  page = 1
}

function addMarkupItems(images) {
  images
    .map(img => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;
      return refs.galleryMarkup.insertAdjacentHTML(
        'beforeend',
        `<li class="gallery__item">
    <div class="card">
      <a class="card__link" href="${largeImageURL}">
      <img class="card__img" src="${webformatURL}" data-source=${largeImageURL} alt="${tags}" loading="lazy" />
      <div class="info">
       <p class="info__item"><b>Likes</b> ${likes}</p>
       <p class="info__item"><b>Views</b> ${views}</p>
       <p class="info__item"><b>Comments</b> ${comments}</p>
       <p class="info__item"><b>Downloads</b> ${downloads}</p>
      </div>
    </div>
    </li>`
      );
    })
    .join('');
  lightbox.refresh();
}
