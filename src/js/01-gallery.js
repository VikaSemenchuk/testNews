// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

console.log(galleryItems);

const divGallery = document.querySelector(".gallery");

function createGalleryMarkup(items) {
  return items
    .map((item) => 
      `<div class="gallery__item"> 
         <a class="gallery__link" href="${item.original}">
           <img class="gallery__image" src="${item.preview}"
             data-sourse="${item.original}"
             alt="${item.description}"/>
         </a>
       </div>`
    )
    .join("");
}

divGallery.innerHTML = createGalleryMarkup(galleryItems);

let gallery = new SimpleLightbox(".gallery__link", {
  captionsData: "alt",
  captionDelay: 250,
});
gallery.on("show.simplelightbox", function () {});