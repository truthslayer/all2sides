function get_name(url) {
    if (url.includes("cnn")) {
	return CNN;
    } else if (url.includes("fox")) {
	return FOX;
    } else if (url.includes("nytimes")) {
	return NYT;
    } else if (url.includes("wall")) {
	return WSJ;
    } else if (url.includes("washington")) {
	return WAPO;	 
    } else {
	alert("something awry, none of the 5 news sites included.");
	return false;
    }
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
	alert("again shouldn't be here.\n");
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
	return NULL;
    }
}
    
function loadPdf(url, cvname, dname, cv2, d2, a, a2) {
    console.log('load pdf ' + url + ' ' + cvname + ' ' + dname);
    var name = get_name(url);
    var gpdf = get_pdf(name);
    if (gpd != NULL) {
	given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2);
    } else {
	// Asynchronous download of PDF 
	PDFJS.getDocument(url).then(pdf => {
	    pdfDocument = pdf;
	    set_correct_page(url, pdf);
	    given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2);
	});
    }
};


function given_pdf(pdf, url, cvname, dname, cv2, d2, a, a2) {
    pdf.getPage(1).then(function (page) {
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
	// this was wrapper, but ideally it'll be the div for the resp canvas. then the reload will just pull the right div up front and no resizing will be necessary. 
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

	setupAnnotations(page, viewport, canvas, annote, 1.33 * sc);
	setupAnnotations(page, viewport, canvas2, annote2, 1.33 * sc);
	var renderContext = {
	    canvasContext: context,
	    viewport: viewport,
	};
	page.render(renderContext);
    });
}

function setupAhidden(page, viewport, cshowing,  $annotationLayerDiv, scale) {
}

function setupAnnotations(page, viewport, canvas, $annotationLayerDiv, scale) {
    var canvasOffset = $(canvas).offset();
    var canvasPos = $(canvas).position();
    var ct = $(canvas).offsetTop;
    var cl = $(canvas).offsetLeft;
    console.log("the value of canvasOffset: " + canvasOffset + "and the value of ct/cl" + ct + ' ' + cl + ' and pos ' + canvasPos);
    console.log(canvasOffset);
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
		    element.style.left = (canvasPos.left +
			rect[0]*scale) + 'px';
		    element.style.top = (canvasPos.top +
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

