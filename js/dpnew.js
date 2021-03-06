// "macros"
var CNN = "cnn";
var FOX = "fox";
var WAPO = "wapo";
var WSJ = "wsj";
var NYT = "nytimes";
// URLs
var nyt = 'www.nytimes.com-wkh.compressed.pdf';
var cnn = 'www.cnn.com-phantomjs.compressed.pdf';
var cnn_png = 'www.cnn.com-phantomjs.compressed.png';
var fox = 'www.foxnews.com-wkh.compressed.pdf';
var wsj = 'www.wsj.com-wkh.compressed.pdf';
var wapo = 'www.washingtonpost.com-wkh.compressed.pdf';
// URLS for puppet versions
var nytpup = 'www.nytimes.com-puppet.compressed.pdf';
var cnnpup = 'www.cnn.com-puppet.compressed.pdf';
var cnnpup = 'www.cnn.com-puppet.compressed.pdf';
var foxpup = 'www.foxnews.com-puppet.compressed.pdf';
var wsjpup = 'www.wsj.com-puppet.compressed.pdf';
var wapopup = 'www.washingtonpost.com-puppet.compressed.pdf';
// the pointers to the pages that should be destroyed when a date is
// changed
var nytp = null;
var cnnp = null;
var foxp = null;
var wsjp = null;
var wapop = null;
var prefix, hprefix = "news-clips/";
var cdate = "";
var puppet = false;

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
	    return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


function notone(name) {
    return  !(name == CNN || name == FOX || name == WAPO || name == WSJ || name == NYT || name == null);
}


var urldate = getUrlParameter('date');
var udate = urldate;
if (urldate == "") {
    udate = new Date();
}
var urlleft =  getUrlParameter('left');
var urlright =  getUrlParameter('right');
console.log('date = ' + urldate + 'left = ' + urlleft + 'right = ' + urlright);
console.log('date = ' + urldate + 'left = ' + urlleft + 'right = ' + urlright);
if (notone(urlleft)) {
    alert("Left name of news-site not valid. Please use one of cnn/foxnews/wapo/wsj/nytimes.");
}
if (notone(urlright)) {
    alert("Right name of news-site not valid. Please use one of cnn/foxnews/wapo/wsj/nytimes.");
}

var s3 = new AWS.S3();

window.onload=function(){
    // to fix the sizing.
    window.onorientationchange = function() {
	do_loads();
    };
 
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

    function release_pdfs() {
	if (nytp != null) {
	    nytp.destroy();
	}
	if (cnnp != null) {
	    cnnp.destroy();
	}
	if (foxp != null) {
	    foxp.destroy();
	}
	if (wsjp != null) {
	    wsjp.destroy();
	}
	if (wapop != null) {
	    wapop.destroy();
	}
	nytp = cnnp = foxp = wsjp = wapop = null;
    }
    
    // CNN
    var canvas1=document.getElementById(CNN + '-canvas');
    var d1 = document.getElementById('div-' + CNN);
    var a1 = document.getElementById('div-' + CNN + '-annote');
    d1.style.display = "none";
    var canvas1right=document.getElementById(CNN + '-canvas-right');
    var d1right = document.getElementById('div-' + CNN + '-right');
    d1right.style.display = "none";
    var a1right = document.getElementById('div-' + CNN + '-annote-right');
    // NYT
    var canvas2=document.getElementById(NYT + '-canvas');
    var d2 = document.getElementById('div-' + NYT);
    d2.style.display = "none";
    var a2 = document.getElementById('div-' + NYT + '-annote');
    var canvas2right=document.getElementById(NYT + '-canvas-right');
    var d2right = document.getElementById('div-' + NYT + '-right');
    d2right.style.display = "none";
    var a2right = document.getElementById('div-' + NYT + '-annote-right');
// FOX    
    var canvas3=document.getElementById(FOX + '-canvas');
    var d3 = document.getElementById('div-' + FOX);
    d3.style.display = "none";
    var a3 = document.getElementById('div-' + FOX + '-annote');
    var canvas3right = document.getElementById(FOX + '-canvas-right');
    var d3right = document.getElementById('div-'  + FOX + '-right');
    var a3right = document.getElementById('div-' + FOX + '-annote-right');
    d3right.style.display = "none";
    // WSJ
    var canvas4=document.getElementById(WSJ + '-canvas');
    var d4 = document.getElementById('div-' + WSJ);
    d4.style.display = "none";
    var a4 = document.getElementById('div-' + WSJ + '-annote');
    var canvas4right=document.getElementById(WSJ + '-canvas-right');
    var d4right = document.getElementById('div-' + WSJ + '-right');
    d4right.style.display = "none";
    var a4right = document.getElementById('div-' + WSJ + '-annote-right');
    // WAPO
    var canvas5=document.getElementById(WAPO + '-canvas');
    var d5 = document.getElementById('div-' + WAPO);
    d5.style.display = "none";
    var a5 = document.getElementById('div-' + WAPO + '-annote');
    var canvas5right=document.getElementById(WAPO + '-canvas-right');
    var d5right = document.getElementById('div-' + WAPO + '-right');
    d5right.style.display = "none";
    var a5right = document.getElementById('div-wapo-annote-right');

    function url_date(date) {
	var stateObj = { index: "index" };
	var pathname = window.location.href; // Returns path only
	var np = pathname.replace(/(&date=.+?)(&|$)/, '&date=' + date+ "$2");
	if (!np.match(/.*&date.*/)) {
	    np = np + "?&date=" + date;
	}
	history.pushState(stateObj, "remembering date", np);
    }
    
    function url_left(name) {
	var stateObj = { index: "index" };
	var pathname = window.location.href; // Returns full url
	var np = pathname.replace(/(&left=.+?)(&|$)/, '&left=' + name + "$2");
	if (!np.match(/.*&left.*/)) {
	    np = np + "&left=" + name;
	}
	history.pushState(stateObj, "remembering date", np);
    }

    function url_right(name) {
	var stateObj = { index: "index" };
	var pathname = window.location.href; // Returns full url
	var np = pathname.replace(/(&right=.+?)(&|$)/, '&right=' + name + "$2" );
	if (!np.match(/.+&right.+/)) {
	    np = np + "&right=" + name;
	}
	history.pushState(stateObj, "remembering date", np);
    }

        
    // All the swaps on the radio clicks
    document.getElementById("cnn").onclick=function(){
	cnnl = swap_l(CNN, cnn, cnnpup, cnnl, cnnr);
    };
    document.getElementById("nytimes").onclick=function(){
	nytl = swap_l(NYT, nyt, nytpup, nytl, nytr);
    };
    document.getElementById("fox").onclick=function(){
	foxl = swap_l(FOX, fox, foxpup, foxl, foxr);
    };
    document.getElementById("wsj").onclick=function(){
	wsjl = swap_l(WSJ, wsj, wsjpup, wsjl, wsjr);
    };
    document.getElementById("wapo").onclick=function(){
	wapol = swap_l(WAPO, wapo, wapopup, wapol, wapor);
    };
    document.getElementById("cnn-right").onclick=function(){
	cnnr = swap_r(CNN, cnn, cnnpup, cnnl, cnnr);
    };
    document.getElementById("nytimes-right").onclick=function(){
	nytr = swap_r(NYT, nyt, nytpup, nytl, nytr);
    };
    document.getElementById("fox-right").onclick=function(){
	foxr = swap_r(FOX, fox, foxpup, foxl, foxr);
    };
    document.getElementById("wsj-right").onclick=function(){
	wsjr = swap_r(WSJ, wsj, wsjpup, wsjl, wsjr);
    };
    document.getElementById("wapo-right").onclick=function(){
	wapor = swap_r(WAPO, wapo, wapopup, wapol, wapor);
    };

    // JM TODO: make sure that render-right does the right thing,
    // load-pdf without loading the precise PDF if there are non-null
    // appropriate pdf things
    function render_right() {
	hide_all();
	var radioValue = $("input[name='group1']:checked").val();
	if (radioValue == CNN) {
	    console.log(CNN);
	    cnnl = swap_l(CNN, cnn, cnnpup, cnnl, cnnr);
	} else if (radioValue == NYT) {
	    console.log("nytimes");
	    nytl = swap_l(NYT, nyt, nytpup, nytl, nytr);
	} else if (radioValue == FOX) {
	    console.log("fox");
	    foxl = swap_l(FOX, fox, foxpup, foxl, foxr);
	} else if (radioValue == WSJ) {
	    console.log("wsj");
	    wsjl = swap_l(WSJ, wsj, wsjpup, wsjl, wsjr);
	} else if (radioValue == WAPO) { // radioValue == wapo
	    console.log(radioValue);
	    console.log("wapo");
	    wapol = swap_l(WAPO, wapo, wapopup, wapol, wapor);
	} else {
	    alert('wtf');
	}
    }

     function render_rightright() {
	hide_allright();
	var radioValue = $("input[name='group1right']:checked").val();
	if (radioValue == "cnn") {
	    console.log("cnn right");
	    cnnr = swap_r(CNN, cnn, cnnpup,  cnnl, cnnr);
	} else if (radioValue == "nytimes") {
	    console.log("nytimes right");
	    nytr = swap_r(NYT, nyt, nytpup, nytl, nytr);
	} else if (radioValue == "fox") {
	    console.log("fox right");
	    foxr = swap_r(FOX, fox, foxpup, foxl, foxr);
	} else if (radioValue == "wsj") {
	    console.log("wsj right");
	    wsjr = swap_r(WSJ, wsj, wsjpup, wsjl, wsjr);
	} else if (radioValue == "wapo") { 
	    console.log('here it is ' + radioValue);
//	    console.log("wapo right");
	    wapor = swap_r(WAPO, wapo, wapopup, wapol, wapor);
	} else {
	    alert('this shouldn\'t happen');
	}
    }

    function hide_all() {
	d1.style.display = "none";
	canvas1.style.visibility  = 'hidden';
//	a1.style.visibility = 'hidden';
	d2.style.display = "none";
	canvas2.style.visibility  = 'hidden';
//	a2.style.visibility = 'hidden';
	d3.style.display = "none";
	canvas3.style.visibility  = 'hidden';
//	a3.style.visibility = 'hidden';
	d4.style.display = "none";
	canvas4.style.visibility  = 'hidden';
//	a4.style.visibility = 'hidden';
	d5.style.display = "none";
	canvas5.style.visibility  = 'hidden';
//	a5.style.visibility = 'hidden';
    }
    
    function hide_allright() {
	d1right.style.display = "none";
	canvas1right.style.visibility  = 'hidden';
//	a1right.style.visibility = 'hidden';
	d2right.style.display = "none";
	canvas2right.style.visibility  = 'hidden';
//	a2right.style.visibility = 'hidden';
	d3right.style.display = "none";
	canvas3right.style.visibility  = 'hidden';
//	a3right.style.visibility = 'hidden';
	d4right.style.display = "none";
	canvas4right.style.visibility  = 'hidden';
//	a4right.style.visibility = 'hidden';
	d5right.style.display = "none";
	canvas5right.style.visibility  = 'hidden';
//	a5right.style.visibility = 'hidden';
    }
    
    function all_false() {
	cnnl = nytl = foxl = wapol = wsjl = false;
	canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height);
	canvas1.style.width, canvas1.style.height = "";
	canvas2.getContext('2d').clearRect(0, 0, canvas2.width, canvas2.height);
	canvas2.style.width, canvas2.style.height = "";
	canvas3.getContext('2d').clearRect(0, 0, canvas3.width, canvas3.height);
	canvas3.style.width, canvas3.style.height = "";
	canvas4.getContext('2d').clearRect(0, 0, canvas4.width, canvas4.height);
	canvas4.style.width, canvas4.style.height = "";
	canvas5.getContext('2d').clearRect(0, 0, canvas5.width, canvas5.height);
	canvas5.style.width, canvas5.style.height = "";
	a1.innerHTML = "";
	a2.innerHTML = "";
	a3.innerHTML = "";
	a4.innerHTML = "";
	a5.innerHTML = "";
	hide_all();

    }

    function all_falseright() {
	cnnr = nytr = foxr = wapor = wsjr = false;
	canvas1right.getContext('2d').clearRect(0, 0, canvas1right.width, canvas1right.height);
	canvas2right.getContext('2d').clearRect(0, 0, canvas2right.width, canvas2right.height);
	canvas3right.getContext('2d').clearRect(0, 0, canvas3right.width, canvas3right.height);
	canvas4right.getContext('2d').clearRect(0, 0, canvas4right.width, canvas4right.height);
	canvas5right.getContext('2d').clearRect(0, 0, canvas5right.width, canvas5right.height);
	a1right.innerHTML = "";
	a2right.innerHTML = "";
	a3right.innerHTML = "";
	a4right.innerHTML = "";
	a5right.innerHTML = "";
	hide_allright();
    }

    
    function reload(cto, cfrom, ato, afrom, w, h) {
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
	// copy the annotations
	var anotefrom = document.getElementById(afrom);
	var ato = document.getElementById(ato);
	// Maybe remember the annotations. hmm.
    }

    
    function write_loading(div) {	
	var text = "Loading PDF, please wait...";
	var dp = document.getElementById(div);
	dp.style.fontSize = '12px';
	dp.style.fontFamily = 'Poppins';
	dp.innerHTML = '<br> ' + text;
    }
    
    function swap_l(name, url, purl,  bl, br) {
	url_left(name);
	hide_all();
	var can1 = name + '-canvas';
	var div1 = 'div-' + name;
	var a1 = 'div-' + name + '-annote';
	var can2 = name + '-canvas-right';
	var div2 = 'div-' + name + '-right';
	var a2 = 'div-' + name + '-annote-right';
	var gc =  document.getElementById(name + '-canvas');
	var gd = document.getElementById('div-' + name);
	gc.style.visibility = 'visible';
	gd.style.display = 'block';
	//	document.getElementById(a1).style.visibility = 'visible';
	if (!bl && !br) {
	    console.log('loading left pdf ' + url);
	    write_loading('loading');
	    puppet_exists(cdate, url, purl, can1, div1, can2, div2, a1, a2);
	    return true;
	} else if (br) {
	    console.log(' trying to reload left');
	    var d2 = document.getElementById(div2);
	    var dw = d2.offsetWidth;
	    var dh = d2.offsetHeight;
	    reload(can1, can2, a1, a2, dw, dh);
	    return false;
	} else {
	    console.log('already loaded left ');
	    return true;
	    // do nothing, it's loaded!
	}
    };

    function swap_r(name, url, purl, bl, br) {
	url_right(name);
	var can1 = name + '-canvas-right';
	var div1 = 'div-' + name + '-right';
	var can2 = name + '-canvas';
	var div2 = 'div-' + name;
	var str = url;
	var a = 'div-' + name + '-annote-right';
	var a2 = 'div-' + name + '-annote';
	hide_allright();
	var gc =  document.getElementById(can1);
	var gd = document.getElementById(div1);
	gc.style.visibility = 'visible';
	gd.style.display = 'block';
//	document.getElementById(a).style.visibility = 'visible';
	if (!bl && !br) {
	    console.log('loading right pdf ');
	    write_loading('loading-right');
	    puppet_exists(cdate, url, purl, can1, div1, can2, div2, a, a2);
	    return true;
	} else if (bl) {
	    reload(can1, can2, a, a2, document.getElementById(div2).width, document.getElementById(div2).height);
	    return false;
	} else {
	    console.log('already loaded right ' + str);
	    return true;
	}
    }

 

    function puppet_exists(cdate,  url, purl, can1, div1, can2, div2, a, a2) {
//	alert(cdate);
//	var h = cdate.format('HH');
//	console.log('checking url '  + url + 'hour ' + h + ' from date ' + cdate.format("YYYY-MM-DD"));
//	var dtj =  cdate.format("YYYY-MM-DD") + '.' + h + '/';
	var all_but =  cdate ;
	var check = all_but +  purl;
	var pparams = {Bucket: 'all2sides.com', Key: check};
	s3.headObject(pparams,
		      function (err,data) {
			    if (err) {
				//				alert('no dice on puppet.');
				// check non-puppet
				var params = {Bucket: 'all2sides.com', Key: all_but + url};
				s3.headObject(params,
					      function(err,data) {
						  if (err) {
						      console.log('double no dice on no puppet.');
						      // Now need to call with a smaller date
				//		      alert('not sure what is happening.');
						      console.log('pdf could not be loaded. Writing such.');
						      var dput;
						      var cd;
						      if (can1.match(/(.*)right(.*)/)) {
							  dput =  'loading-right';
							  cd = 'date-space-right';
						      } else {
							  dput =  'loading';
							  cd = 'date-space';
						      }
						      var dp = document.getElementById(dput);
						      dp.style.fontSize = '12px';
						      dp.style.fontFamily = 'Poppins';
						      dp.innerHTML = "This PDF cannot load. Try another date/site!";
						      var cp = document.getElementById(cd);
						      cp.style.fontSize = '12px';
						      cp.style.fontFamily = 'Poppins';
						      cp.innerHTML = "";
						  } else {
						      //						   console.log("Error. " + check + ' not found' );
						      // alert('not puppet, but success!\n');
						      loadPdf(cdate + url, can1, div1, can2, div2, a, a2);
						      return true;
						  }
					      });
			    } else {
				// alert('it existed! puppet load\n');
				loadPdf(cdate + purl, can1, div1, can2, div2, a, a2);
				return true;
			    }
			});
    }


    
function date_obj_now() {
    return moment().tz('America/New_York');
}

function date_now() {
    var lT = moment().tz('America/New_York');
    return(lT.format("YYYY-MM-DD"));
}
function date_yesterday() {
    var lT = moment().tz('America/New_York');
    lT.subtract(1, 'days');
    return(lT.format("YYYY-MM-DD"));
}

function today(td){
    var now = moment().tz('America/New_York');
    return  now.isSame(td, 'd');
  }
      
function do_loads() {
    all_false();
    all_falseright();
    release_pdfs();
    render_rightright();
    render_right();
}

    
		 
    

function swap_to_puppet(url) {
    var url_new = url.replace(/wkh/i, 'puppet');
    return  url_new.replace(/phantomjs/i, 'puppet');
}

    

    function check_get_dates(dcurr) {
	console.log('here' + dcurr);
	if (!today(dcurr)) {
	    console.log('not today');
	    var c =  date_yesterday() + '.23/'; 
	    cdate = 'news-clips/' + c;
	    url_date(c);
	    // load pdfs
	    do_loads();
	}
	var h = dcurr.format('HH');
	console.log('checking hour ' + h + ' from date ' + dcurr.format("YYYY-MM-DD"));
	var dtj =  dcurr.format("YYYY-MM-DD") + '.' + h + '/';
	var all_but = 'news-clips/' + dtj ;
	var url = all_but +  cnn;
	console.log('checking ' + url + ' and ' + swap_to_puppet(url));
	var pparams = {Bucket: 'all2sides.com', Key: swap_to_puppet(url)};
	s3.headObject(pparams, function(err, data) {
	    if (err) {
		console.log('check_get_dates puppet no dice.');
		var params = {Bucket: 'all2sides.com', Key: url};
		s3.headObject(params, function(err, data) {
		    if (err) {
			// Now need to call with a smaller date
			console.log('check_get_dates nonpuppet no dice.');
			var dnew = dcurr.subtract(1, 'hours');
			check_get_dates(dnew);
		    } else {
			cdate = all_but;
			url_date(dtj);
			// load pdfs
			do_loads();			
		    }});
	    } else {
		cdate = all_but;
		url_date(dtj);
		// load pdfs
		do_loads();
	    }});
    }
		


function dt_now() {
    var lT = moment().tz('America/New_York');
    return(lT.format("YYYY-MM-DD.HH"));
}

    
    function if_today(att, val) {
	if (today(att)) {
	    var lT = moment().tz('America/New_York');
	    check_get_dates(lT);
	} else  {
	    dtn = val + ".23";
	    cdate = hprefix + dtn + "/";
	    url_date(dtn + '/');
	    do_loads();
	}
    }

    function set_date(val) {
	if (val == null || !val.match(/....-..-..\...\//)) {
	    alert('Poorly formatted date in url. Must have \'YYYY-MM-DD.HH/\'');
	}  else {
	    cdate = hprefix + val;
	    do_loads();
	}
    }    
    
    // datepicker
    var checkin = $('.dpd1').datepicker()
	.on('click', function (ev) {
            $('.datepicker').css("z-index", "999999999");
	}).data('datepicker');
    var startDate = new Date('03/01/2017');
    jQuery(function($) {
	$(".date").datepicker({
	    minDate: startDate,
            maxDate : 0,
	dateFormat: "yy-mm-dd",
	onSelect: function(dateText) {
	    var attempt = $(this).datepicker('getDate');
	    var mom = moment(attempt);
	    if_today(mom, this.value);
	}
    }).on("change", function() {
	var attempt = $(this).datepicker('getDate');
	var mom = moment(attempt);
	if_today(mom, this.value);
    }).datepicker("setDate", new Date(udate));
	var m = moment(urldate, "YYYY-MM-DD.HH/");
	if (!m.isValid()) {
	    m = date_obj_now();
	    if_today(m);
	}  else {
	    set_date(urldate);
	}
    });

    $(document).ready(function () {
	$('body').on('click', 'a', function(e) {
	    e.target.target = '_blank';
	});

    });

}
