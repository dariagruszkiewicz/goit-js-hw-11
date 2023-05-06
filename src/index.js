import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const KEY = '35804077-868b4923c4d4b0980765f3041';
const inputEl = document.querySelector('input[type="text"]');
const formEl = document.getElementById('search-form');
const containerEl = document.querySelector('.gallery');
console.log(containerEl);

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const names = inputEl.value;
  console.log(names);
});

const getData = async name => {
  const API_URL = 'https://pixabay.com/api/?';

  await axios
    .get(API_URL, {
      params: {
        key: KEY,
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(res => {
      const item = res;
      const itemData = item.data.hits;
      console.log(itemData);

      containerEl.textContent = '';
      itemData.map(item => {
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');
        containerEl.append(photoCard);
        const imageEl = document.createElement('img');
        imageEl.src = item.webformatURL;
        imageEl.alt = item => item.tags;
        imageEl.setAttribute('loading', 'lazy');
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
        photoCard.append(imageEl, infoImage);
      });

      if (itemData.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        const totalHits = itemData.length;
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    })
    .catch(err => console.log(err));
};

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const names = inputEl.value;
  getData(names);
});
