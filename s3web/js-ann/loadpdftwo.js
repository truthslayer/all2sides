
function loadPdf(url, cvname, dname, cv2, d2, a, a2) {
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
	// this was wrapper, but ideally it'll be the div for the resp canvas. then the reload will just pull the right div up front and no resizing will be necessary. 
	var wrapper = document.getElementById(dname);
	var ldiv = document.getElementById('div-left');
	console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	var sc = ldiv.clientWidth * .7 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper.style.height = Math.floor(viewport.height * sc) + 'pt';


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
	var sc = ldiv.clientWidth * .7 / viewport.width;
	console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	wrapper2.style.width = Math.floor(viewport.width * sc) + 'pt';
	wrapper2.style.height = Math.floor(viewport.height * sc) + 'pt';


	
	// Render PDF page into canvas context.
	var renderContext = {
            canvasContext: context,
            viewport: viewport
	};
	var renderContext2 = {
            canvasContext: context2,
            viewport: viewport
	};
	page.render(renderContext);

	var annote = document.getElementById(a);
	annote.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote.style.height = Math.floor(viewport.height * sc) + 'pt';
	var annote2 = document.getElementById(a);
	annote2.style.width = Math.floor(viewport.width * sc) + 'pt';
	annote2.style.height = Math.floor(viewport.height * sc) + 'pt';
        setupAnnotations(page, viewport, canvas, annote);
	});

    function setupAnnotations(page, viewport, canvas, annote) {
	var canvasOffset = $(canvas).offset();
        var promise = page.getAnnotations().then(function (annotationsData) {
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
                rect = PDFJS.Util.normalizeRect([
                rect[0],
                view[3] - rect[1] + view[1],
                rect[2],
                view[3] - rect[3] + view[1]]);
                element.style.left = (canvasOffset.left + rect[0]) + 'px';
                element.style.top = (canvasOffset.top + rect[1]) + 'px';
                element.style.position = 'absolute';

                var transform = viewport.transform;
                var transformStr = 'matrix(' + transform.join(',') + ')';
                CustomStyle.setProp('transform', element, transformStr);
                var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
                CustomStyle.setProp('transformOrigin', element, transformOriginStr);

/*                if (data.subtype === 'Link' && !data.url) {
                    // In this example,  I do not handle the `Link` annotations without url.
                    // If you want to handle those links, see `web/page_view.js`.
                    continue;
                }*/
                annote.append(element);
            }
        });
        return promise;
    };
})}


