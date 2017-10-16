function slideable() {
    $(function(){
	shctrl = $('div.slidehelp');                          //cache selector for speed
	
	try {                                                 //At beginning, try to...
	    document.createEvent("TouchEvent");               //...create a "TouchEvent"
	    $('p.keyinst').css('display','none');             //If successful, remove key instructions
	    $('p.touchinst').css('display','block');          //and display touch instructions
	}
	catch (e) {
	    $('p.keyinst').css('display','block');            //Error? Display key instructions
	    $('p.touchinst').css('display','none');           //and hide touch instructions
	};
	
	$(document).keydown(function(e){                      //Catch keydown anywhere in document
	    arw = e.which;                                    //Get key that was clicked
	    getcl = $('.ui-page-active').attr('class');       //Get the class of the active page
	    slidetst = getcl.match(/slidehelp/g);             //Is 'slidehelp' among the classes?
	    if (slidetst[0] == 'slidehelp') {
		chngpage(arw);                                //If so, go to the changepage routine
	    };
	});
	
	shctrl.live('swipeleft swiperight',function(event){  //Catch left/right swipes in div.slidehelp
	    if (event.type == 'swipeleft') {                 //Was it a swipe to the left?
		chngpage(39);                                //Change page as if it were right arrow
	    };
	    if (event.type == 'swiperight') {                //Was it a swipe to the right?
		chngpage(37);                                //Change page as if it were left arrow
	    };
	});
	
	function chngpage(dir) {
	    //Get current page's ID. In this example, we start on "cooking1_2"
	    getid = $('.ui-page-active').attr('id');
	    //What is the "series name" of the current page? In this example: "cooking"
	    slideseries = getid.replace(/\d+_\d+/g,'');
	    //How many slides does this series have?
	    //Get the number AFTER the underscore to find out. In this example: 2
	    slidemax = parseInt((getid.replace(/\w+_/g,'')),10);
	    //What is the number of the current slide?
	    //Get the number BEFORE the underscore to find out. In "cooking1_2": 1
	    slidecur = parseInt(((getid.replace(/_\d+/g,'')).replace(/[A-Za-z]/g,'')),10);
	    //If we're moving to the right...
	    if (dir == 39) {
		//Test by adding 1 to the current slide number
		tstpeek = slidecur + 1;
		//If we haven't exceeded the maximum number of slides...
		if (tstpeek <= slidemax) {
		    //Generate a URL string for the next slide
		    newpg = '#' + slideseries + tstpeek.toString() + '_' + slidemax.toString();
		    //And change to it by sliding everything to the left
		    $.mobile.changePage( newpg, { transition: 'slide', reverse: false} );
		}
		else {
		    //Otherwise, tell user they're at the last page
		    alert('There is nothing else after this page.');
		};
	    };
	    //If we're moving to the left...
	    if (dir == 37) {
		//Test by subtracting 1 from the current slide number
		tstpeek = slidecur - 1;
		//If we're not trying to go back before slide 1...
		if (tstpeek >= 1) {
		    //Generate the URL string for the previous slide
		    newpg = '#' + slideseries + tstpeek.toString() + '_' + slidemax.toString();
		    //And change to it by sliding everything to the right
		    $.mobile.changePage( newpg, { transition: 'slide', reverse: true} );
		}
		else {
		    //Otherwise, tell user they're at the first page
            alert('There is nothing else before this page.');
		};
	    };
	};
    });
}
