import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const inputEl = document.querySelector('input[type="text"]');
const formEl = document.getElementById('search-form');
const KEY = '35804077-868b4923c4d4b0980765f3041';

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const names = inputEl.value;
  console.log(names);
});

const getData = name => {
  const API_URL = 'https://pixabay.com/api/?';

  axios
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

      const details = itemData.map(item =>
        console.log(
          item.webformatURL,
          item.largeImageURL,
          item.tags,
          item.likes,
          item.views,
          item.comments,
          item.downloads
        )
      );
      if (itemData.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(err => console.log(err));
};

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const names = inputEl.value;
  getData(names);
});
