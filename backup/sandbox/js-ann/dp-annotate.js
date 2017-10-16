    function dt_now() {
	var lT = moment().tz('America/New_York');
	var lTnew = lT.format('hh:mm:ss a');
	var mins = lT.minutes();
	if (mins < 15) {
	    lT.subtract(1, 'hours');
	}

	var hrs = lT.hours();
        var rounded = hrs < 6 ? 0 : hrs < 9? 6 :  hrs < 12 ? 9 : hrs < 18 ? 12 : hrs < 21 ? 18 : hrs < 23 ? 21 : 23 ;
	if (rounded == 0) {
		lT.subtract(1, 'days');
		rounded = 23;
        }
	lT.hours(rounded);
	var yr = lT.year();
	var mon = lT.month();
	var day = lT.date();
//	alert(lT.format("YYYY-MM-DD") + "." + lT.hours());
	return(lT.format("YYYY-MM-DD.HH"));
	
    }

window.onload=function(){

    var cnnl = false;
    var nytl = false;
    var foxl = false;
    var wsjl = false;
    var wapol = false;
    var cnnr = false;
    var nytr = false;
    var foxr = false;
    var wsjr = false;
    var wapor = false;
    
    var nyt = 'www.nytimes.com-wkh.pdf';
    var cnn = 'www.cnn.com-phantomjs.pdf';
    var fox = 'www.foxnews.com-wkh.pdf';
    var wsj = 'www.wsj.com-wkh.pdf';
    var wapo = 'www.washingtonpost.com-wkh.pdf';
    var date = 'news-clips/' +  dt_now() + '/';
    var cdate = date;
    var canvas1=document.getElementById('cnn-canvas');
    var d1 = document.getElementById('div-cnn');
    d1.style.display = "none";
    var canvas1right=document.getElementById('cnn-canvas-right');
    var d1right = document.getElementById('div-cnn-right');
    d1right.style.display = "none";
    //    loadPdf(date  + cnn, 'cnn-canvas');
    //  var cnnl = true;
    var canvas2=document.getElementById('nytimes-canvas');
    var d2 = document.getElementById('div-nyt');
    d2.style.display = "none";
    var canvas2right=document.getElementById('nytimes-canvas-right');
    var d2right = document.getElementById('div-nyt-right');
    d2right.style.display = "none";
    //    loadPdf(date + nyt, 'nytimes-canvas');
//     canvas2.getContext('2d').fillText('This is nytimes',20,20);
    var canvas3=document.getElementById('fox-canvas');
    var d3 = document.getElementById('div-fox');
    d3.style.display = "none";
    var canvas3right = document.getElementById('fox-canvas-right');
    var d3right = document.getElementById('div-fox-right');
    d3right.style.display = "none";

    //loadPdf(date + fox, 'fox-canvas');
  //  canvas3.getContext('2d').fillText('This is fox' ,20,20);
    var canvas4=document.getElementById('wsj-canvas');
    var d4 = document.getElementById('div-wsj');
    d4.style.display = "none";
    var canvas4right=document.getElementById('wsj-canvas-right');
    var d4right = document.getElementById('div-wsj-right');
    d4right.style.display = "none";
    //loadPdf(date + wsj, 'wsj-canvas');
    // canvas4.getContext('2d').fillText('This is wsj' ,20,20);
    var canvas5=document.getElementById('wapo-canvas');
    var d5 = document.getElementById('div-wapo');
    d5.style.display = "none";
    var canvas5right=document.getElementById('wapo-canvas-right');
    var d5right = document.getElementById('div-wapo-right');
    d5right.style.display = "none";
    //canvas5.getContext('2d').fillText('This is wapo' ,20,20);
    //loadPdf(date + wapo, 'wapo-canvas');*/
    //swapCanvases1();
    //swapCanvases3right();

/*
  //  var sc = 'scale(.5)';
  //  document.body.style.webkitTransform = sc;       // Chrome, Opera, Safari
  //  document.body.style.msTransform = sc;        // IE 9
    document.body.style.transform = sc;     // General
*/

    document.getElementById("cnn").onclick=function(){
	swapCanvases1();
    };
    
document.getElementById("nytimes").onclick=function(){
  swapCanvases2();
};
document.getElementById("fox").onclick=function(){
  swapCanvases3();
};
document.getElementById("wsj").onclick=function(){
  swapCanvases4();
};
document.getElementById("wapo").onclick=function(){
  swapCanvases5();
};


    document.getElementById("cnn-right").onclick=function(){
  swapCanvases1right();
};
document.getElementById("nytimes-right").onclick=function(){
  swapCanvases2right();
};
document.getElementById("fox-right").onclick=function(){
  swapCanvases3right();
};
document.getElementById("wsj-right").onclick=function(){
  swapCanvases4right();
};
document.getElementById("wapo-right").onclick=function(){
  swapCanvases5right();
};

    function render_right() {
	hide_all();
	var radioValue = $("input[name='group1']:checked").val();
	if (radioValue == "cnn") {
	    console.log("cnn");
	    swapCanvases1();
	} else if (radioValue == "nytimes") {
	    console.log("nytimes");
	    swapCanvases2();
	} else if (radioValue == "fox") {
	    console.log("fox");
	    swapCanvases3();
	} else if (radioValue == "wsj") {
	    console.log("wsj");
	    swapCanvases4();
	} else { // radioValue == wapo
	    console.log(radioValue);
	    console.log("wapo");
	    swapCanvases5();
	}
    }

     function render_rightright() {
	hide_allright();
	var radioValue = $("input[name='group1right']:checked").val();
	if (radioValue == "cnn") {
	    console.log("cnn right");
	    swapCanvases1right();
	} else if (radioValue == "nytimes") {
	    console.log("nytimes right");
	    swapCanvases2right();
	} else if (radioValue == "fox") {
	    console.log("fox right");
	    swapCanvases3right();
	} else if (radioValue == "wsj") {
	    console.log("wsj right");
	    swapCanvases4right();
	} else { // radioValue == wapo
	    console.log('here it is ' + radioValue);
//	    console.log("wapo right");
	    swapCanvases5right();
	}
    }

    function hide_all() {
	d1.style.display = "none";
	canvas1.style.visibility  = 'hidden';
	d2.style.display = "none";
	canvas2.style.visibility  = 'hidden';
	d3.style.display = "none";
	canvas3.style.visibility  = 'hidden';
	d4.style.display = "none";
	canvas4.style.visibility  = 'hidden';
	d5.style.display = "none";
	canvas5.style.visibility  = 'hidden';
    }
    
    function hide_allright() {
	d1right.style.display = "none";
	canvas1right.style.visibility  = 'hidden';
	d2right.style.display = "none";
	canvas2right.style.visibility  = 'hidden';
	d3right.style.display = "none";
	canvas3right.style.visibility  = 'hidden';
	d4right.style.display = "none";
	canvas4right.style.visibility  = 'hidden';
	d5right.style.display = "none";
	canvas5right.style.visibility  = 'hidden';
    }
    function all_false() {
	cnnl = nytl = foxl = wapol = wsjl = false;
	canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height);
	canvas2.getContext('2d').clearRect(0, 0, canvas2.width, canvas2.height);
	canvas3.getContext('2d').clearRect(0, 0, canvas3.width, canvas3.height);
	canvas4.getContext('2d').clearRect(0, 0, canvas4.width, canvas4.height);
	canvas5.getContext('2d').clearRect(0, 0, canvas5.width, canvas5.height);
	hide_all();
    }

        function all_falseright() {
	 cnnr = nytr = foxr = wapor = wsjr = false;
	canvas1right.getContext('2d').clearRect(0, 0, canvas1right.width, canvas1right.height);
	canvas2right.getContext('2d').clearRect(0, 0, canvas2right.width, canvas2right.height);
	canvas3right.getContext('2d').clearRect(0, 0, canvas3right.width, canvas3right.height);
	canvas4right.getContext('2d').clearRect(0, 0, canvas4right.width, canvas4right.height);
	canvas5right.getContext('2d').clearRect(0, 0, canvas5right.width, canvas5right.height);
	hide_allright();
    }


    function reload(cto, cfrom, dto, w, h) {
	console.log('reload ' + cto + ' to ' + cfrom);
	var canvto =  document.getElementById(cto);
	var ctxto = canvto.getContext('2d');
	var canvfrom =  document.getElementById(cfrom);
	var ctxfrom = canvfrom.getContext('2d');

	var sourceCtx, destinationCtx, imageData;
	//get the context of each canvas
	//copy the data
	imageData = ctxfrom.getImageData(0, 0, canvfrom.width - 1, canvfrom.height - 1);
	//apply the image data
	ctxto.putImageData(imageData, 0, 0);
	//done
    }

    function swap_left(can1, div1,  can2, div2, str, bl, br, a1, a2) {
	hide_all();
	var gc =  document.getElementById(can1);
	var gd = document.getElementById(div1);
	gc.style.visibility = 'visible';
	gd.style.display = 'block';
	if (!bl && !br) {
	    console.log('loading left pdf ' + str);
	    loadPdf(cdate + str, can1, div1, can2, div2, a1, a2);
	} else if (br) {
	    console.log(' trying to reload left ' + str);
	    var d2 = document.getElementById(div2);
	    var dw = d2.offsetWidth;
	    var dh = d2.offsetHeight;
	    reload(can1, can2, div1, dw, dh);
	} else {
	    console.log('already loaded left ' + str);
	    // do nothing, it's loaded!
	}
    }

    function swap_right(can1, div1, can2, div2, a2, str, bl, br, a1, a2) {
	hide_allright();
	var gc =  document.getElementById(can1);
	var gd = document.getElementById(div1);
	gc.style.visibility = 'visible';
	gd.style.display = 'block';
	if (!bl && !br) {
	    console.log('loading right pdf ' + str);
	    loadPdf(cdate + str, can1, div1, can2, div2, a1, a2);
	} else if (bl) {
	    reload(can1, can2, div1, document.getElementById(div2).width, document.getElementById(div2).height);
	} else {
	    console.log('already loaded right ' + str);
	}
    }

    
    function swapCanvases1(){
	swap_left('cnn-canvas', 'div-cnn', 'cnn-canvas-right', 'div-cnn-right', cnn, cnnl, cnnr, 'div-cnn-annotation', 'div-cnn-annotation-right');
	cnnl = true;
    }

    function swapCanvases1right(){
	swap_right('cnn-canvas-right', 'div-cnn-right', 'cnn-canvas', 'div-cnn', cnn, cnnl, cnnr, 'div-cnn-annotation-right', 'div-cnn-annotation');
	cnnr = true;
    }

    function swapCanvases2(){
	swap_left('nytimes-canvas', 'div-nyt', 'nytimes-canvas-right', 'div-nyt-right', nyt, nytl, nytr, 'div-nyt-annotation', 'div-nyt-annotation-right');
	nytr = true;
    }

    function swapCanvases2right(){
	swap_right('nytimes-canvas-right', 'div-nyt-right', 'nytimes-canvas', 'div-nyt', nyt, nytl, nytr,  'div-nyt-annotation-right', 'div-nyt-annotation');
	nytr = true;
    }

    function swapCanvases3(){
	swap_left('fox-canvas', 'div-fox', 'fox-canvas-right', 'div-fox-right', fox, foxl, foxr,  'div-fox-annotation', 'div-fox-annotation-right');
	foxl = true;
    }

    function swapCanvases3right(){
	swap_right('fox-canvas-right', 'div-fox-right', 'fox-canvas', 'div-fox', fox, foxl, foxr, 'div-fox-annotation-right', 'div-fox-annotation');
	foxr = true;
    }

    function swapCanvases4(){
	swap_left('wsj-canvas', 'div-wsj', 'wsj-canvas-right', 'div-wsj-right', wsj, wsjl, wsjr, 'div-wsj-annotation', 'div-wsj-annotation-right');
	wsjl = true;
    }

    function swapCanvases4right(){
	swap_right('wsj-canvas-right', 'div-wsj-right', 'wsj-canvas', 'div-wsj', wsj, wsjl, wsjr, 'div-wsj-annotation-right', 'div-wsj-annotation');
	wsjr = true;
    }
    function swapCanvases5(){
	swap_left('wapo-canvas', 'div-wapo', 'wapo-canvas-right', 'div-wapo-right', wapo, wapol, wapor, 'div-wapo-annotation', 'div-wapo-annotation-right');
	wapol = true;
    }

    function swapCanvases5right(){
	swap_right('wapo-canvas-right', 'div-wapo-right', 'wapo-canvas', 'div-wapo', wapo, wapol, wapor, 'div-wapo-annotation-right', 'div-wapo-annotation');
	wapor = true;
    }
    
jQuery(function($) {
    $(".date").datepicker({
        maxDate : 0,
	dateFormat: "yy-mm-dd",

	onSelect: function(dateText) {
	    var attempt = $(this).datepicker('getDate');
	    var dtn = dt_now();
	    if (!today(attempt)) {
		dtn = this.value + ".23";
	    }
	    var coeff = hprefix + dtn + "/";
	    all_false();
	    all_falseright();
	    cdate = coeff;
	    render_right();
	    render_rightright();
	}
    }).on("change", function() {
	var attempt = $(this).datepicker('getDate');
	var dtn = dt_now();
	if (!today(attempt)) {
	    dtn = this.value + ".23";
	}
	var coeff = hprefix + dtn + "/";
	all_false();
	all_falseright();
	cdate = coeff;
	render_right();
	render_rightright();
    }).datepicker("setDate", new Date());
    var prefix = "news-clips/";
    var hprefix = prefix;

  function today(td){
      var d = new Date();
      return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
  }

    function tweek(td){
	var d = new Date();
	var tdn = td.getDate();
	var dn = d.getDate();
	return tdn <= dn && tdn >= dn -7;
    }
     
});

       
$(document).ready(function () {
 var prefix = "news-clips/";
    var hprefix = prefix;
    function dt_now() {
	var lT = moment().tz('America/New_York');
	var lTnew = lT.format('hh:mm:ss a');
	var mins = lT.minutes();
	if (mins < 15) {
	    lT.subtract(1, 'hours');
	}

	var hrs = lT.hours();
        var rounded = hrs < 6 ? 0 : hrs < 9? 6 :  hrs < 12 ? 9 : hrs < 18 ? 12 : hrs < 21 ? 18 : hrs < 23 ? 21 : 23 ;
	if (rounded == 0) {
		lT.subtract(1, 'days');
		rounded = 23;
        }
	lT.hours(rounded);
	var yr = lT.year();
	var mon = lT.months();
	var day = lT.date();
	alert(lT.format("YYYY-MM-DD") + "." + lT.hours());
	return(lT.format("YYYY-MM-DD.HH"));
	
    }
    $("#mydate").datepicker().datepicker( "setDate", new Date());


});

}
