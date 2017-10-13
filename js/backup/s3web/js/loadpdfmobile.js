var  scalez = .7;


function get_name(url) {
    if (url.includes("cnn")) {
	return CNN;
    } else if (url.includes("fox")) {
	return FOX;
    } else if (url.includes("nytimes")) {
	return NYT;
    } else if (url.includes("wsj")) {
	return WSJ;
    } else if (url.includes("washington")) {
	return WAPO;	 
    } else {
	alert("something awry, none of the 5 news sites included. url =" + url);
	return false;
    }
}
    
function write_loading(div) {	
    var text = "Loading PDF, please wait...";
    var dp = document.getElementById(div);
    dp.style.fontSize = '12px';
    dp.style.fontFamily = 'Poppins';
    dp.innerHTML = '<br> ' + text;
}

function get_named(elem) {
    var url = elem.id;
    if (url.includes("cnn")) {
	return CNN;
    } else if (url.includes("fox")) {
	return FOX;
    } else if (url.includes("ny")) {
	return NYT;
    } else if (url.includes("wsj")) {
	return WSJ;
    } else if (url.includes("wapo")) {
	return WAPO;	 
    } else {
	alert("something awry, none of the 5 news sites included. url =" + url);
	return false;
    }
}

function get_url(name) {
     if (name == CNN) {
	return cdate + cnn;
    } else if (name == FOX) {
	return cdate + fox;
    } else if (name == NYT) {
	return  cdate + nyt;
    } else if (name == WSJ) {
	return  cdate + wsj;
    } else if (name == WAPO) {
	return  cdate + wapo;
    } else {
	alert("something awry, none of the 5 news sites included. name =" + url);
	return false;
    }
}

function get_scale(name) {
  if (name == CNN) {
	return 1.0;
    } else if (name == FOX) {
	return 2.0;
    } else if (name == NYT) {
	return 1.5;
    } else if (name == WSJ) {
	return 1.5;
    } else if (name == WAPO) {
	return 1.5;
    } else {
	alert('wtf');
	return 1.0;
    }
}
    
function get_pdf(name) {
    if (name == CNN) {
	return cnnp;
    } else if (name == FOX) {
	return foxp;
    } else if (name == NYT) {
	return nytp;
    } else if (name == WSJ) {
	return wsjp;
    } else if (name == WAPO) {
	return wapop;
    } else {
	alert('wtf');
	return null;
    }
}

function get_date(url) {
    var m =    url.match(/(.*)\/(.*)\/(.*)/);
    var d =  m[2];
    var ymdh = url.match(/(....)-(..)-(..)\.(..)/);
    return ymdh[4] +  ':00 on ' + ymdh[2] + '/' + ymdh[3] + '/' + ymdh[1];
}

function set_date_space(dname, url) {
    var dput;
    if (dname.match(/(.*)right(.*)/)) {
	dput =  'date-space-right';
    } else {
	dput =  'date-space';
    }
    var text = get_date(url);
    var dp = document.getElementById(dput);
    dp.style.fontSize = '12px';
    dp.style.fontFamily = 'Poppins';
    dp.innerHTML = '<br><br><br>Content collected at: ' + text;
}


function set_correct_page(url, pdf) {
    var name = get_name(url);
    if (name == CNN) {
	cnnp = pdf;
    } else if (name == FOX) {
	foxp = pdf;
    } else if (name == NYT) {
	nytp = pdf;
    } else if (name == WSJ) {
	wsjp = pdf;
    } else if (name == WAPO) {
	wapop = pdf;
    } else {
	alert("again shouldn't be here. " + url);
    }
}

function remove_loading(cname) {
    var dput;
    if (cname.match(/(.*)right(.*)/)) {
	dput =  'loading-right';
    } else {
	dput =  'loading';
    }
    var dp = document.getElementById(dput);
    dp.style.fontSize = '12px';
    dp.style.fontFamily = 'Poppins';
    dp.innerHTML = "";
}

function get_pdf(name) {
    if (name == CNN) {
	return cnnp;
    } else if (name == FOX) {
	return foxp;
    } else if (name == NYT) {
	return nytp;
    } else if (name == WSJ) {
	return wsjp;
    } else if (name == WAPO) {
	return wapop;
    } else {
	alert('wtf');
	return null;
    }
}

function get_loaded(divname) {
    var n = get_named(divname);
    var url = get_url(n);
    if (get_pdf(n) == null) {
	write_loading('loading');
	loadPdf(url, n + '-canvas' , 'div-' + n, 'garbage', 'garbage-div', 'div-' + n + '-annote', 'garbage-div-annote');
    }
}


function loadPdf(url, cvname, dname, cv2, d2, a, a2) {
    set_date_space(dname, url);    
    console.log('load pdf ' + url + ' ' + cvname + ' ' + dname + ' ' + d2 + ' ' + a + ' ' + a2);
    var name = get_name(url);
    var gpdf = get_pdf(name);
    if (gpdf != null) {
	given_pdf(pdf, 'http://all2sides.com/' + url, cvname, dname, cv2, d2, a, a2);
    } else {
	// asychronous :)
	PDFJS.getDocument('http://all2sides.com/' + url).then(function(pdf) {
	    pdfDocument = pdf;
	    set_correct_page(url, pdf);
	    given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2);
	}, function(error){
	    console.log('pdf could not be loaded. Writing such.');
	    var dput;
	    var cd;
	    if (cvname.match(/(.*)right(.*)/)) {
		dput =  'loading-right';
		cd = 'date-space-right';
	    } else {
		dput =  'loading';
		cd = 'date-space';
	    }
	    var dp = document.getElementById(dput);
	    dp.style.fontSize = '12px';
	    dp.style.fontFamily = 'Poppins';
	    dp.innerHTML = "<br> <br> <br> This PDF cannot load. Try another date/site!";
	    var cp = document.getElementById(cd);
	    cp.style.fontSize = '12px';
	    cp.style.fontFamily = 'Poppins';
	    cp.innerHTML = "";
	});
    }
};

function given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2) {
    pdf.getPage(1).then(function (page) {
	console.log('here');
	console.log(pdf + ' ' + url + ' ' + cvname + ' ' + dname + ' ' + cv2 + ' ' + d2 + ' ' + a + ' ' + a2);
	console.log('Page loaded');
	var scale = get_scale(get_name(url));
	var viewport = page.getViewport(scale);
	// Prepare canvas using PDF page dimensions.
	var canvas = document.getElementById(cvname);
	var context = canvas.getContext('2d');
	canvas.width = viewport.width;
	canvas.height = viewport.height;
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	// this was wrapper, but ideally it'll be the div for the resp
	// canvas. then the reload will just pull the right div up
	// front and no resizing will be necessary.
	var pdfContainer = document.getElementById(dname);
	var ldiv = document.getElementById('div_1');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * scalez / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	pdfContainer.style.width = Math.floor(viewport.width * sc) + 'pt';
	pdfContainer.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote = document.getElementById(a);
	annote.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote.style.height = Math.floor(viewport.height * sc) + 'pt';

	setupAnnotations(page, viewport, cvname, annote,   1.33  * sc * scale);
	var renderContext = {
	    canvasContext: context,
	    viewport: viewport,
	};
	page.render(renderContext);
	remove_loading(cvname);
    });
}


function setupAnnotations(page, viewport, canvas, $annotationLayerDiv, scale) {
    var promise = page.getAnnotations().then(function(annotationsData) {
	viewport = viewport.clone({
	    dontFlip: true
	});
	for (var i = 0; i < annotationsData.length; i++) {
	    var data = annotationsData[i];
	    var annotation = PDFJS.Annotation.fromData(data);
	    if (!annotation || !annotation.hasHtml()) {
		continue;
	    }

	    var element = annotation.getHtmlElement(page.commonObjs);
	    data = annotation.getData();
	    var rect = data.rect;
	    var view = page.view;
	    /* console.log(' here ' + rect[0] + ' ' +
	       (view[3] - rect[1] + view[1])  + ' ' +
	       rect[2]+ ' ' +
	       (view[3] -  rect[3] + view[1]));*/
	    rect = PDFJS.Util.normalizeRect([
		rect[0],
		view[3] - rect[1] + view[1] ,
		rect[2],
		view[3] -  rect[3] + view[1]
	    ]);
	    // weird offset canvas issue
	    //		    if ($(canvas).id) {
	    var dv = document.getElementById(canvas);
	    var dp = dv.parentNode;
	    var dpp = dp.parentNode;
	    
	    element.style.left = (// jm is trying something else canvasPos.left +
		dpp.offsetLeft +
				  rect[0]*scale) + 'px';
	    element.style.top = (// canvasPos.top +
				dpp.offsetTop +
				 rect[1]*scale) + 'px';
	    /*		    } else {
			    element.style.left = (
			    //canvasOffset.left +
			    rect[0]*scale) + 'px';
			    element.style.top = (
			    //canvasOffset.top +
			    rect[1]*scale) + 'px';
			    }*/
	    element.style.width = Math.ceil(scale * (rect[2] - rect[0])) + 'px'
	    element.style.height = Math.ceil(scale * (rect[3] - rect[1])) + 'px'
	    element.style.position = 'absolute';

	    var transform = viewport.transform;
	    var transformStr = 'matrix(1,0,0,1,0,0)';// + transform.join(',') + ')';
	    CustomStyle.setProp('transform', element, transformStr);
	    var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
	    CustomStyle.setProp('transformOrigin', element, transformOriginStr);

	    if (data.subtype === 'Link' && !data.url) {
		// In this example,  we do not handle the `Link` annotation without url.
		// If you want to handle these links, see `web/page_view.js`.
		continue;
	    }
	    $annotationLayerDiv.append(element);
	}
    });
    return promise;
};

