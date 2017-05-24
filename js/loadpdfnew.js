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
    dp.innerHTML = '<br>Content collected at: ' + text;
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


function cnn_special(url, cvname, dname, cv2, d2, a, a2) {
    // Check if the png exits.
    console.log('checking dates for cnn png ' + url);
    if (get_name(url) != CNN) {
	alert('only call with cnn!');
    }
    var url_new = url.replace(/pdf/i, 'png');
    console.log("cnn url new " +  url_new);
    var params = {Bucket: 'all2sides.com', Key: url_new};
    s3.headObject(params, function(err, data) {
	if (err) {
	    // load the pdf like a normal fucking person
//	    alert('did not find png.');
	    var gpdf = get_pdf(CNN);
	    if (gpdf != null) {
		// we already have a pdf
		given_pdf(pdf, url, cvname,
			      dname, cv2, d2, a, a2);
	    } else {
		// don't yet have a pdf
		PDFJS.getDocument('http://all2sides.com/' + url).then(pdf => {
		    pdfDocument = pdf;
		    set_correct_page(url, pdf);
		    given_pdf(pdf, url, cvname,
			      dname, cv2, d2, a, a2);
		});
	    }
	} else {
	    // if so, load the pdf (to get the annotations) but not render
	    // it. It should fill the canvas with the compressed png
	    //	    alert('did find png!');
	    // Load the pdf, which will load the png in the canvas too, and do annotations
	    var gpdf = get_pdf(CNN);
	    if (gpdf != null) {
		given_pdf_cnn(pdf, url_new, cvname,
			      dname, cv2, d2, a, a2);
	    } else {	// Asynchronous download of PDF 
		PDFJS.getDocument('http://all2sides.com/' + url).then(pdf => {
		    pdfDocument = pdf;
		    set_correct_page(url, pdf);
		    given_pdf_cnn(pdf, url_new, cvname, dname, cv2, d2, a, a2);
		});
	    }
	    return false;
	}
    });
}

// JM todo: make sure that you don't render the pdf, but instead the
// png at the url Just load the annotations :)
function given_pdf_cnn(pdf, url, cvname, dname, cv2, d2, a, a2) {
    pdf.getPage(1).then(function (page) {
	console.log('here');
	console.log(pdf + ' ' + url + ' ' + cvname + ' ' + dname + ' ' + cv2 + ' ' + d2 + ' ' + a + ' ' + a2);
	console.log('Page loaded');
	var scale = 1;
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
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * .8 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	pdfContainer.style.width = Math.floor(viewport.width * sc) + 'pt';
	pdfContainer.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote = document.getElementById(a);
	annote.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote.style.height = Math.floor(viewport.height * sc) + 'pt';

// setting up the other canvas/annotations
	var canvas2 = document.getElementById(cv2);
	var context2 = canvas2.getContext('2d');
	canvas2.width = viewport.width;
	canvas2.height = viewport.height;
	canvas2.style.width = "100%";
	canvas2.style.height = "100%";
	// this was wrapper, but ideally it'll be the div for the resp canvas. then the reload will just pull the right div up front and no resizing will be necessary. 
	var wrapper2 = document.getElementById(d2);
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper2.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper2.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote2 = document.getElementById(a2);
	annote2.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote2.style.height = Math.floor(viewport.height * sc) + 'pt';

	setupAnnotations(page, viewport, cvname, annote,   1.33  * sc);
	setupAnnotations(page, viewport, cv2, annote2, 1.33 *  sc);
	var renderContext = {
	    canvasContext: context,
	    viewport: viewport,
	};
	//JM: render the png here!
//	page.render(renderContext);
	var img = new Image();
	var can = document.getElementById(cvname);
	var ctx = can.getContext('2d');
	img.src =  'http://all2sides.com/' + url;
	alert( 'http://all2sides.com/' + url);
	img.onload = function () {
	    ctx.drawImage(img, 0, 0);
	    remove_loading(cvname);
	}
    });
    
}

function loadPdf(url, cvname, dname, cv2, d2, a, a2) {
    set_date_space(dname, url);    
    console.log('load pdf ' + url + ' ' + cvname + ' ' + dname + ' ' + d2 + ' ' + a + ' ' + a2);
    var name = get_name(url);
    if (name == CNN) {
	cnn_special(url, cvname, dname, cv2, d2, a, a2);
	return;
    } else {
	var gpdf = get_pdf(name);
	if (gpdf != null) {
	    given_pdf(pdf, 'http://all2sides.com/' + url, cvname, dname, cv2, d2, a, a2);
	} else {
	    // Asynchronous download of PDF 
	    window.addEventListener('error', function(e) {
		console.log(e + ' I caught this!');
	    }, true);
	    PDFJS.getDocument('http://all2sides.com/' + url).then(pdf => {
		pdfDocument = pdf;
		set_correct_page(url, pdf);
		given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2);
	    });
/* what I'll put in that catch for future*/
		// Print "whoops no pdf found!" on the canvas.
	/*	var dput;
		if (cvname.match(/(.*)right(.*)/)) {
		    dput =  'loading-right';
		} else {
		    dput =  'loading';
		}
		var dp = document.getElementById(dput);
		dp.style.fontSize = '12px';
		dp.style.fontFamily = 'Poppins';
		dp.innerHTML = "This PDF cannot load. Try another date/site!";
	*/
	     window.removeEventListener('error', function(e) {
		console.log(e + ' I caught this!');
	    }, true);
	}
    }
};

function given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2) {
    pdf.getPage(1).then(function (page) {
	console.log('here');
	console.log(pdf + ' ' + url + ' ' + cvname + ' ' + dname + ' ' + cv2 + ' ' + d2 + ' ' + a + ' ' + a2);
	console.log('Page loaded');
	var scale = 1;
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
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * .8 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	pdfContainer.style.width = Math.floor(viewport.width * sc) + 'pt';
	pdfContainer.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote = document.getElementById(a);
	annote.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote.style.height = Math.floor(viewport.height * sc) + 'pt';

// setting up the other canvas/annotations
	var canvas2 = document.getElementById(cv2);
	var context2 = canvas2.getContext('2d');
	canvas2.width = viewport.width;
	canvas2.height = viewport.height;
	canvas2.style.width = "100%";
	canvas2.style.height = "100%";
	// this was wrapper, but ideally it'll be the div for the resp canvas. then the reload will just pull the right div up front and no resizing will be necessary. 
	var wrapper2 = document.getElementById(d2);
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper2.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper2.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote2 = document.getElementById(a2);
	annote2.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote2.style.height = Math.floor(viewport.height * sc) + 'pt';

	setupAnnotations(page, viewport, cvname, annote,   1.33  * sc);
	setupAnnotations(page, viewport, cv2, annote2, 1.33 *  sc);
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
	    var transformStr = 'matrix(' + transform.join(',') + ')';
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

