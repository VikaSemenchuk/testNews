const newsList = document.querySelector('.news-list');
const API_KEY = 'api-key=HR9YxGV98GGTmMcKHA5eY4Aer5nJgRvJ';
import localStorageService from '../localStorageService/localStorageService';
import {
  checkLokalStorage,
  removeFavoriteBtnHTML,
  addFavoriteBtnHTML,
  alreadyRead,
  handleFavorite,
  handleRead,
  // defaultImg,
} from '../render/render';
const axios = require('axios').default;
class MostPopularApiService {
  //   constructor() {
  //     this.page = 1;
  //     this.searchQuery = '';
  //     this.perPage = 40;
  //   }

  async getNews() {
    // const URL = `${ENDPOINT}?${API_KEY}&q=${this.searchQuery}`; // це для пошуку
    const mostPopularUrl = `https://api.nytimes.com/svc/mostpopular/v2/viewed/30.json?${API_KEY}`;
    const response = await axios.get(mostPopularUrl);
    // console.log(response.data.results[0].media[0]['media-metadata'][0].url);
    return response.data.results;
  }

  //   nextPage() {
  //     this.page += 1;
  //   }
  //   resetPage() {
  //     this.page = 1;
  //   }
}
async function render() {
  //рендерить  популярні новини
  const mostPopularApiService = new MostPopularApiService();

  const articles = await mostPopularApiService.getNews();
  console.log('🚀 ~ articles', articles);
  if (articles.length === 0) throw new Error('No data');

  let i = 0;
  const card = articles.reduce((markup, article) => {
    i++;
    console.log(articles[2].media);
   
  // console.log(defaultImg);
    const cardData = {
      image: article.media[0]['media-metadata'][2].url,
      section: article.section,
      title: article.title,
      description: article.abstract,
      date: article.published_date,
      url: article.url,
      id: article.id,
    }
    if (articles[2].media.length !== 0) {
      cardData.image = article.media[0]['media-metadata'][2].url;
    } else {
      cardData.image = `https://cdn.create.vista.com/api/media/small/251043028/stock-photo-selective-focus-black-news-lettering`;
    }
    console.log(cardData.image);
    return markup + createMostPopularNews(cardData, i);
  }, '');

}

function updateCard(markup) {
  newsList.innerHTML = markup;
}

function createMostPopularNews(cardData, i) {
  // створює розмітку популярних новин
  const { description, date, section, title, image, url, id } = cardData;
  setTimeout(() => {
  console.log(id);

    // виконається після того як з'являться картки
    const btn = document.querySelector(`.favorite-btn--${id}`);
    const link = document.querySelector(`.news-link--${id}`);
    const p = document.querySelector(`.isread--${id}`);
    const card = document.querySelector(`.news-card--${id}`);
    console.log(btn);

    let isFav = false;
    let localFavorite = localStorageService.load('favorite');
    console.log(localFavorite);
    let checkFavorite = checkLokalStorage(cardData, localFavorite);
    if (checkFavorite === true) {
      btn.innerHTML = removeFavoriteBtnHTML;
      btn.classList.add('favorite-btn--active');
    }
    let localArr = localStorageService.load('readMoreLocal');
    let checkRead = checkLokalStorage(cardData, localArr);
    if (checkRead === true) {
      p.innerHTML = alreadyRead;
      card.classList.add('opacity');
    }
    btn.onclick = handleFavorite(isFav, cardData, btn);
    link.onclick = handleRead(cardData, p, card);
  }, 0);
  console.log(btn);

  // if (media.length !== 0) {
  //   defaultImg = media[0]['media-metadata'][2].url;
  // }

  // if (media.length !== 0) {
  //   if (media[0]['media-metadata'][2].url) {
  //     defaultImg = media[0]['media-metadata'][2].url;
  //     return
  //   }
  //    else {
  //      const attachURL = `https://www.nytimes.com/`;
  //      defaultImg = `${attachURL}${media[0].url}`;
  //      return
  //   }
  // } 
  // else if (media !== null) {
  //     defaultImg = media[2].url;
  //     return
  //   }
  updateCard(card);

  return `<div class="news-card ${`news-card--${id}`} grid grid-item-${i}">

    <div class="top-wrap">
      <img
        src="${image}"
        loading="lazy"
        width="288"
        height="395"
        class="news-img"
      />
      <p class="isread ${`isread--${id}`}"></p>
      <div class="category-wrap">
        <p class="top-text">${section}</p>
      </div>
      <button class="favorite-btn ${`favorite-btn--${id}`}" data-id="${id}">
        ${addFavoriteBtnHTML}
      </button>
    </div>
    <div class="info">
      <h2 class="info-item">${title}</h2>
      <p class="describe">${description.slice(0, 150) + '...'}</p>
      <div class="lower-content">
        <p class="news-date">${date.slice(0, 10)
          .replaceAll('-', '/')}</p>
        <a class="news-link ${`news-link--${id}`} link" href="${url}"  onclick="handleRead()" target="_blank">Read more</a>
      </div>
    </div>
  </div>
  
`;
}
render();
