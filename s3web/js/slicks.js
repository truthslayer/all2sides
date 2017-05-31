$(document).ready(function(){
  $('.your-class').slick({
      arrows: true,
  });


    $('.your-class').on('afterChange', function(event, slick, currentSlide, nextSlide){
	console.log('after change slide ' + nextSlide);
	console.log('event' + event + 'slick' + slick + 'currentSlide' + currentSlide+ 'nextslide' + nextSlide);
	var currentSlide = $('.your-class').slick('slickCurrentSlide');
	console.log('currentslides maybe the elem? ' + currentSlide);
	var elt = slick.$slides.get(currentSlide);
	console.log('elt ' + elt);
	get_loaded(elt);
    });

});

