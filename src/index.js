import ImagesApiService from './js/ImageApiService';
import LoadMoreBtn from './js/components/LoadMoreBtn';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');

let totalImages = 0;

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

let gallery = new SimpleLightbox('.gallery__link');

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  //   form.elements[1].disabled = false

  imagesApiService.searchQuary = value;

  if (imagesApiService.searchQuary === '') {
    Notiflix.Notify.failure(
      "The search field can't be empty. Please, enter your request."
    );
    // loadMoreBtn.hide();
    return;
  }
  //   fetchImages().finally(() => form.reset());
  //   console.log(value);
  clearGallery();
  imagesApiService.resetPage();

  try {
    const { hits, totalHits } = await imagesApiService.getImages();
    totalImages = 0;
    totalImages += hits.length;

    if (totalHits >= 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      // loadMoreBtn.enable();
    }
    if (totalHits === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      //   loadMoreBtn.hide();
      return;
    }
    if (totalHits > 40) {
      loadMoreBtn.enable();
      loadMoreBtn.show();
    }
    if (totalImages >= totalHits) {
      console.log(totalImages);
      setTimeout(() => {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }, 2000);
      loadMoreBtn.hide();
    }

    const markup = await hits.reduce(
      (markup, hit) => createMarkup(hit) + markup,
      ''
    );
    createGallery(markup);
  } catch (response) {
    // onError(response)
    Notiflix.Notify.failure(`Oops, error: ${response}`);
    loadMoreBtn.hide();
  }
}

async function onLoadMore() {
  loadMoreBtn.disable();

  try {
    const { hits, totalHits } = await imagesApiService.getImages();

    totalImages += hits.length;
    console.log(totalImages);

    if (totalImages >= totalHits) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      console.log(imagesApiService.perPage);
      loadMoreBtn.hide();
    }

    const markup = await hits.reduce(
      (markup, hit) => createMarkup(hit) + markup,
      ''
    );
    createGallery(markup);
    const { height: cardHeight } =
      galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    loadMoreBtn.enable();
    return totalHits;
  } catch (response) {
    // onError(response)
    Notiflix.Notify.failure(`Oops, error: ${response}`);
    loadMoreBtn.hide();
  }
}

function createGallery(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);

  //   galleryEl.innerHTML = markup;
  gallery.refresh();
}

function clearGallery() {
  // galleryEl.insertAdjacentHTML('beforeend', markup);
  galleryEl.innerHTML = '';
}

// function onError(err) {
//   if (err) {
//     console.log(err);
//   }
//   // тут вивести повідомлення користувачу
//   //   Notiflix.Notify.warning(imagesApiService.response.status)
//   console.log(err);
//   loadMoreBtn.hide();
// }

//   return imagesApiService
// .getImages()
// .then(({ hits, totalHits }) => {
//   sumTotal += hits.length;
//   console.log('total', sumTotal);
//   //   if (imagesApiService.searchQuary === '') {
//   //     Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
//   //     loadMoreBtn.isHidden()
//   //   }

//   if (totalHits >= 1) {
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//   }

//   if (sumTotal >= totalHits) {
//     Notiflix.Notify.warning(
//       "We're sorry, but you've reached the end of search results."
//     );

//     loadMoreBtn.hide();
//   }
//   console.log(hits);
//   console.log(totalHits);

//   return hits.reduce((markup, hit) => createMarkup(hit) + markup, '');
// })
// .then(markup => {
//   createGallery(markup);
//   loadMoreBtn.enable();
// })
// .catch(onError);
