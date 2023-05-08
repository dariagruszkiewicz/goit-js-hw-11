import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
const KEY = '35804077-868b4923c4d4b0980765f3041';
const inputEl = document.querySelector('input[type="text"]');
const formEl = document.getElementById('search-form');
const containerEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let perPage = 40;
loadMoreBtn.style.display = 'none';

const createGallery = async name => {
  const API_URL = 'https://pixabay.com/api/?';

  await axios
    .get(API_URL, {
      params: {
        key: KEY,
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    })
    .then(res => {
      loadMoreBtn.style.display = 'flex';
      const item = res;
      const itemData = item.data.hits;

      containerEl.textContent = '';
      itemData.map(item => {
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');
        containerEl.append(photoCard);
        const imageRef = document.createElement('a');
        imageRef.href = item.largeImageURL;
        photoCard.append(imageRef);
        const imageEl = document.createElement('img');
        imageEl.src = item.webformatURL;
        imageEl.alt = item.tags;
        imageEl.setAttribute('loading', 'lazy');
        imageRef.append(imageEl);
        const infoImage = document.createElement('div');
        infoImage.classList.add('info');
        infoImage.innerHTML = `
          <p class="info-item">
        <b>Likes</b><br>
        ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b><br>
        ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b><br>
        ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b><br>
        ${item.downloads}
      </p>`;
        photoCard.append(infoImage);
      });

      let gallery = new SimpleLightbox('.gallery a');
      gallery.on('show.simplelightbox');

      if (itemData.length === 0) {
        loadMoreBtn.style.display = 'none';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        const totalHits = item.data.total;
        Notify.success(`Hooray! We found ${totalHits} images.`);

        if (page > totalHits / perPage) {
          loadMoreBtn.style.display = 'none';
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    })

    .catch(err => console.log(err));
};

const showNextPage = () => {
  page++;
  const names = inputEl.value;
  createGallery(names);
};

formEl.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  const names = inputEl.value;
  createGallery(names);
});

loadMoreBtn.addEventListener('click', showNextPage);
