import { error } from'@pnotify/core';
import"@pnotify/core/dist/PNotify.css";
import '@pnotify/core/dist/BrightTheme.css';
import './styles.scss';
import getRefs from './scripts/get-refs';
import imgMarkupTpl from './templates/img-card.hbs';
import ImgApiService from './scripts/apiService';
import { onModalOpen } from './scripts/modal-open';


const refs = getRefs();
const imgApiService = new ImgApiService();


refs.searchForm.addEventListener('submit', onSearch)
refs.galleryListContainer.addEventListener('click', onModalOpen)

function onSearch(e) {
  e.preventDefault();
  
  imgApiService.query = e.currentTarget.elements.query.value;

  if (imgApiService.query === ''|| imgApiService.query === ' ') {
  return error({
  text: "Sorry. You entered invalid text ("
});
}
  imgApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

  function fetchImages() {
    imgApiService.fetchImages().then(images => {
      appendImagesMarkup(images);
  })
}

function appendImagesMarkup(images) {
  refs.galleryListContainer.insertAdjacentHTML('beforeend', imgMarkupTpl(images))
}

function clearImagesContainer() {
  refs.galleryListContainer.innerHTML = '';
}

//Infinite Scroll (Intersection observer)
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imgApiService.query !== '') {
      fetchImages();
    }
  });
}


const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px'
});
observer.observe(refs.targetObserver);




