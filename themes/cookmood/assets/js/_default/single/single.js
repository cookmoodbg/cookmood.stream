import { SlideshowController } from '../../util/slideshow.js';

document.addEventListener('DOMContentLoaded', function () {
  let slideshowController = new SlideshowController('slideshowSlides');
  slideshowController.init();

  document
    .getElementById('button_slideshow_left')
    .addEventListener('click', function () {
      slideshowController.plusDivs(-1);
    });

  document
    .getElementById('button_slideshow_right')
    .addEventListener('click', function () {
      slideshowController.plusDivs(+1);
    });
  
});
