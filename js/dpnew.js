var isMobile = false; //initiate as false
// device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    	|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if (isMobile == true) {
    window.confirm("Would you like to try our mobile version?");
    if (confirm("Press a button!") == true) {
	txt = "You pressed OK!";
    } else {
	txt = "You pressed Cancel!";
    }
}

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

    // All the swaps on the radio clicks
    document.getElementById("cnn").onclick=function(){
	cnnl = swap_l(CNN, cnn, cnnl, cnnr);
    };
    document.getElementById("nytimes").onclick=function(){
	nytl = swap_l(NYT, nyt, nytl, nytr);
    };
    document.getElementById("fox").onclick=function(){
	foxl = swap_l(FOX, fox, foxl, foxr);
    };
    document.getElementById("wsj").onclick=function(){
	wsjl = swap_l(WSJ, wsj, wsjl, wsjr);
    };
    document.getElementById("wapo").onclick=function(){
	wapol = swap_l(WAPO, wapo, wapol, wapor);
    };
    document.getElementById("cnn-right").onclick=function(){
	cnnr = swap_r(CNN, cnn, cnnl, cnnr);
    };
    document.getElementById("nytimes-right").onclick=function(){
	nytr = swap_r(NYT, nyt, nytl, nytr);
    };
    document.getElementById("fox-right").onclick=function(){
	foxr = swap_r(FOX, fox, foxl, foxr);
    };
    document.getElementById("wsj-right").onclick=function(){
	wsjr = swap_r(WSJ, wsj, wsjl, wsjr);
    };
    document.getElementById("wapo-right").onclick=function(){
	wapor = swap_r(WAPO, wapo, wapol, wapor);
    };

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

     function render_rightright() {
	hide_allright();
	var radioValue = $("input[name='group1right']:checked").val();
	if (radioValue == "cnn") {
	    console.log("cnn right");
	    cnnr = swap_r(CNN, cnn, cnnl, cnnr);
	} else if (radioValue == "nytimes") {
	    console.log("nytimes right");
	    nytr = swap_r(NYT, nyt, nytl, nytr);
	} else if (radioValue == "fox") {
	    console.log("fox right");
	    foxr = swap_r(FOX, fox, foxl, foxr);
	} else if (radioValue == "wsj") {
	    console.log("wsj right");
	    wsjr = swap_r(WSJ, wsj, wsjl, wsjr);
	} else if (radioValue == "wapo") { 
	    console.log('here it is ' + radioValue);
//	    console.log("wapo right");
	    wapor = swap_r(WAPO, wapo, wapol, wapor);
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
    
    function swap_l(name, url, bl, br) {
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

    function swap_r(name, url, bl, br) {
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
	    loadPdf(cdate + str, can1, div1, can2, div2, a, a2);
	    return true;
	} else if (bl) {
	    reload(can1, can2, a, a2, document.getElementById(div2).width, document.getElementById(div2).height);
	    return false;
	} else {
	    console.log('already loaded right ' + str);
	    return true;
	}
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

function check_get_dates(dcurr) {
    if (!today(dcurr)) {
//	alert('call check get dates only with today!' + dcurr.format("YYY-MM-DD:HH"));
    }
    if (dcurr.hours() == 0) {
	//  yesterday
	cdate = 'news_clips/' + date_yesterday() + '.23/'; 
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
	    do_loads();
	}
    }

    
    // old
/*    
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
		release_pdfs();
		cdate = coeff;
		render_rightright();
		render_right();
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
	release_pdfs();
	render_rightright();
	render_right();

    }).datepicker("setDate", new Date());
    var prefix = "news-clips/";
    var hprefix = prefix;
    var dtn = dt_now();
    var coeff = hprefix + dtn + "/";
    all_false();
    all_falseright();
    cdate = coeff;
    release_pdfs();
    render_rightright();
    render_right();     
    }); */
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
    }).datepicker("setDate", new Date());
	var m = date_obj_now();
	check_get_dates(m);
    });

    $(document).ready(function () {
	$('body').on('click', 'a', function(e) {
	    e.target.target = '_blank';
	});

	$("#mydate").datepicker().datepicker( "setDate", new Date());
    });

}
