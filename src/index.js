import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
const KEY = '35804077-868b4923c4d4b0980765f3041';
const inputEl = document.querySelector('input[type="text"]');
const formEl = document.getElementById('search-form');
const containerGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let perPage = 40;
loadMoreBtn.style.display = 'none';

const fetchApi = async () => {
  const API_URL = 'https://pixabay.com/api/?';

  const data = await axios.get(API_URL, {
    params: {
      key: KEY,
      q: inputEl.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });
  return data;
};

const loadPhotos = () => {
  fetchApi()
    .then(photos => {
      console.log(photos);

      loadMoreBtn.style.display = 'flex';

      let gallery = new SimpleLightbox('.gallery a');
      gallery.on('show.simplelightbox');

      if (photos.data.hits.length === 0) {
        loadMoreBtn.style.display = 'none';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        const totalHits = photos.data.total;
        Notify.success(`Hooray! We found ${totalHits} images.`);

        if (page >= totalHits / perPage) {
          loadMoreBtn.style.display = 'none';
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
      containerGallery.innerHTML = showPhotos(photos);
    })

    .catch(err => console.log(err));
};

const showPhotos = item => {
  return item.data.hits
    .map(
      item =>
        `<div class="photo-card">
          <a href="${item.largeImageURL}">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">
            <b>Likes</b><br>
            ${item.likes}
          </p>
          <p class="info-item flex flex-col text-center">
            <b>Views</b><br>
            ${item.views}
          </p>
          <p class="info-item flex flex-col text-center">
            <b>Comments</b><br>
            ${item.comments}
          </p>
          <p class="info-item flex flex-col text-center">
            <b>Downloads</b><br>
            ${item.downloads}
          </p>
        </div>
    </div>`
    )
    .join('');
};

formEl.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  fetchApi();
  loadPhotos();
});

const showNextPage = () => {
  fetchApi().then(photos => {
    console.log(photos);
    containerGallery.insertAdjacentHTML('beforeend', showPhotos(photos));

    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();
  });

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

loadMoreBtn.addEventListener('click', () => {
  page++;
  showNextPage();
});
