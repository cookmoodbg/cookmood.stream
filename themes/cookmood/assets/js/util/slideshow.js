export function SlideshowController(imageClassSelector) {
  var slideIndex = 1;
  this.init = function () {
    this.showDivs(slideIndex);
  };
  this.plusDivs = function (n) {
    this.showDivs((slideIndex += n));
  };
  this.showDivs = function (n) {
    var i;
    var x = document.getElementsByClassName(imageClassSelector);
    if (n > x.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = x.length;
    }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    x[slideIndex - 1].style.display = 'block';
  };
}
