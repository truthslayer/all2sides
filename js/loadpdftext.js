
'use strict';

function loadPdf(url, cvname, dname, cv2, d2, dt, dt2) { 
    console.log('load pdf ' + url + ' ' + cvname + ' ' + dname);
// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

// Asynchronous download of PDF
var loadingTask = PDFJS.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
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
	var wrapper = document.getElementById(dname);
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * .7 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper.style.height = Math.floor(viewport.height * sc) + 'pt';


	// Make the second canvas the right size
	var canvas2 = document.getElementById(cv2);
	var context2 = canvas2.getContext('2d');
	canvas2.width = viewport.width;
	canvas2.height = viewport.height;
	canvas2.style.width = "100%";
	canvas2.style.height = "100%";
	var wrapper2 = document.getElementById(d2);
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * .7 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper2.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper2.style.height = Math.floor(viewport.height * sc) + 'pt';

/*
	var pdfPageView = new PDFJS.PDFPageView({
	    container: wrapper,
	    id: 1,
	    scale: 1,
	    defaultViewport: viewport,
	    // We can enable text/annotations layers, if needed
	    textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
	    annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
	});
	// Associates the actual page with the view, and drawing it
	pdfPageView.setPdfPage(pdfPage);
	return pdfPageView.draw();*/

	
	// Render PDF page into canvas context.
	var renderContext = {
            canvasContext: context,
            viewport: viewport
	};
	var renderContext2 = {
            canvasContext: context2,
            viewport: viewport
	};

	page.render(renderContext)
	    .then(function() {
		// Get text-fragments
		return page.getTextContent();
	    })
	    .then(function(textContent) {
		// Make the text divs the right size/offset
		var container = document.getElementById(dt);
		container.style.width = `${viewport.width}px`;
		container.style.height = `${viewport.height}px`;


		console.log(dt + container);
		PDFJS.renderTextLayer({
		    textContent,
		    container,
		    viewport,
		    textDivs: []
		});
		console.log(textContent);
	    });
	let paget = document.getElementById(dname);
	paget.setAttribute('data-loaded', 'true');

//	page.render(renderContext);
//	page.render(renderContext2);
    })
})}


