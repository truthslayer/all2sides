
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
// the pointers to the pages that should be destroyed when a date is
// changed
var nytp = null;
var cnnp = null;
var foxp = null;
var wsjp = null;
var wapop = null;
var prefix, hprefix = "news-clips/";
var cdate = "";

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
	$('.your-class').slick('slickGoTo', 0);
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
//    d1.style.display = "none";
    // NYT
    var canvas2=document.getElementById(NYT + '-canvas');
    var d2 = document.getElementById('div-' + NYT);
  //  d2.style.display = "none";
    var a2 = document.getElementById('div-' + NYT + '-annote');
    // FOX    
    var canvas3=document.getElementById(FOX + '-canvas');
    var d3 = document.getElementById('div-' + FOX);
    //d3.style.display = "none";
    var a3 = document.getElementById('div-' + FOX + '-annote');
    // WSJ
    var canvas4=document.getElementById(WSJ + '-canvas');
    var d4 = document.getElementById('div-' + WSJ);
   // d4.style.display = "none";
    var a4 = document.getElementById('div-' + WSJ + '-annote');
    // WAPO
    var canvas5=document.getElementById(WAPO + '-canvas');
    var d5 = document.getElementById('div-' + WAPO);
    //d5.style.display = "none";
    var a5 = document.getElementById('div-' + WAPO + '-annote');


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

    // JM TODO: make sure that render-right does the right thing,
    // load-pdf without loading the precise PDF if there are non-null
    // appropriate pdf things
    function render_right() {
	hide_all();
	var radioValue = $("input[name='group1']:checked").val();
	if (radioValue == CNN) {
	    console.log(CNN);
	    cnnl = swap_l(CNN, cnn, cnnl, cnnr);
	} else if (radioValue == NYT) {
	    console.log("nytimes");
	    nytl = swap_l(NYT, nyt, nytl, nytr);
	} else if (radioValue == FOX) {
	    console.log("fox");
	    foxl = swap_l(FOX, fox, foxl, foxr);
	} else if (radioValue == WSJ) {
	    console.log("wsj");
	    wsjl = swap_l(WSJ, wsj, wsjl, wsjr);
	} else if (radioValue == WAPO) { // radioValue == wapo
	    console.log(radioValue);
	    console.log("wapo");
	    wapol = swap_l(WAPO, wapo, wapol, wapor);
	} else {
	    alert('wtf');
	}
    }

    function hide_all() {
/*	d1.style.display = "none";
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
  */  }
    
    
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

    
    function swap_l(name, url, bl, br) {
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
	    loadPdf(cdate + url, can1, div1, can2, div2, a1, a2);
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
    release_pdfs();
    render_right();
}

    function check_get_dates(dcurr) {
	if (!today(dcurr)) {
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
    var params = {Bucket: 'all2sides.com', Key: url};
    s3.headObject(params, function(err, data) {
	if (err) {
	    dcurr.subtract(1, 'hours');
	    check_get_dates(dcurr);
	} else {
	    cdate = all_but;
	    url_date(dtj);
	    // load pdfs
	    do_loads();
	}
    });
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
	    $('.your-class').slick('slickGoTo', 0);
	    if_today(mom, this.value);
	}
    }).on("change", function() {
	var attempt = $(this).datepicker('getDate');
	var mom = moment(attempt);
	$('.your-class').slick('slickGoTo', 0);
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
