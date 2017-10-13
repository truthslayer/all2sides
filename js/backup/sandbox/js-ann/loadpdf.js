function loadPdf(url, cvname) {
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
	var theDiv = document.getElementById('div-left');
	var dwidth = theDiv.clientWidth/2;
	canvas.width = dwidth;
	var sview = page.getViewport(canvas.width/page.getViewport(1.0).width);
	canvas.height = sview.height;
	
	// Render PDF page into canvas context.
	var renderContext = {
            canvasContext: context,
            viewport: sview
	};
	page.render(renderContext);
    })
})}


