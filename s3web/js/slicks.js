$(document).ready(function(){
  $('.your-class').slick({
      arrows: true,
  });


    $('.your-class').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	console.log('before change slide ' + nextSlide);
	console.log('event' + event + 'slick' + slick + 'currentSlide' + currentSlide+ 'nextslide' + nextSlide);
	var currentSlide = $('.your-class').slick('slickCurrentSlide');
	console.log('currentslides maybe the elem? ' + currentSlide);
	var elt = slick.$slides.get(nextSlide);
	console.log('elt ' + elt);
	get_loaded(elt);
    });

});

