
    function makePdf(url, cname, dname, aname) {
	//var url = "news-clips/2017-04-01.23/www.foxnews.com-wkh.pdf";
	// var pdfData = loadPDFData();
	PDFJS.getDocument(url).then(pdf => {
	    pdfDocument = pdf;
	    return pdf.getPage(1);
	}).then(function (page) {
            var scale = 1;
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById(cname);
            var context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
	    var pdfContainer = document.getElementById(dname);
            pdfContainer.height = canvas.height + "px";
	    pdfContainer.width = canvas.width + "px";

            var renderContext = {
		canvasContext: context,
		viewport: viewport
            };
            page.render(renderContext);
	    var annote = document.getElementById(aname);
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
    }
