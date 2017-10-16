
function makePdf(url, cname, dname, aname, tname ) {
	//var url = "news-clips/2017-04-01.23/www.foxnews.com-wkh.pdf";
    // var pdfData = loadPDFData();
    console.log(url + ' ' + cname  + ' ' + dname  + ' '  + aname  + ' '  + tname);
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
	    canvas.style.width = "100%";
	    canvas.style.height = "100%";
	    var pdfContainer = document.getElementById(dname);
/*            pdfContainer.height = canvas.height + "px";
	    pdfContainer.width = canvas.width + "px";
*/	    
	    var ldiv = document.getElementById('div-left');
	    console.log('ldiv ' + ldiv.offsetWidth + 'viewport w' + viewport.width);
	    var sc =  ldiv.clientWidth * .7 / viewport.width;
	    console.log('scale ' + sc + ' means width is ' + viewport.width * sc);
	    pdfContainer.style.width = Math.floor(viewport.width * sc) + 'pt';
	    pdfContainer.style.height = Math.floor(viewport.height * sc) + 'pt';
	    var annote = document.getElementById(aname);
	    annote.style.width = Math.floor(viewport.width * sc) + 'pt';
	    annote.style.height = Math.floor(viewport.height * sc) + 'pt';
	    setupTextLayer(page, canvas, $(tname), sc).then(function(textLayer) {
		var renderContext = {
		    canvasContext: context,
		    viewport: viewport,
		    textLayer: textLayer
		};
		page.render(renderContext);
	    }).then(function() {
		return setupAnnotations(page, viewport, canvas, annote, 2.66* sc);
	    });
	});

	function setupTextLayer(page, canvas, $textLayerDiv, scale) {
	    var canvasOffset = $(canvas).offset();
	    $textLayerDiv.css("height", (canvas.height * scale) + "px")
		.css("width",(canvas.width * scale) + "px")
		.offset({
		    top: canvasOffset.top,
		    left: canvasOffset.left
		});
    

	    var context = canvas.getContext("2d");
	    var outputScale =getOutputScale(context);
	    console.log(outputScale);
	    if (outputScale.scaled) {
		var cssScale = 'scale(1,1)';//' + scale + ', ' +  scale + ')'; //(1 / outputScale.sx) + ', ' + (1 / outputScale.sy) + ')';
		CustomStyle.setProp('transform', canvas, cssScale);
		CustomStyle.setProp('transformOrigin', canvas, '0% 0%');

		if ($textLayerDiv.get(0)) {
		    CustomStyle.setProp('transform', $textLayerDiv.get(0), cssScale);
		    CustomStyle.setProp('transformOrigin', $textLayerDiv.get(0), '0% 0%');
		}
	    }
	    
	    context._scaleX = outputScale.sx;
	    context._scaleY = outputScale.sy;
	    if (outputScale.scaled) {
		context.scale(outputScale.sx, outputScale.sy);
	    }

	    var promise = page.getTextContent().then(function(textContent) {
		var textLayer = new TextLayerBuilder({
		    textLayerDiv: $textLayerDiv.get(0),
		    pageIndex: page.pageIndex
		});
		textLayer.setTextContent(textContent);
		return textLayer;
	    });
	    return promise;
	}

	function setupAnnotations(page, viewport, canvas, $annotationLayerDiv, scale) {
	    var canvasOffset = $(canvas).offset();
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
		    element.style.left = (canvasOffset.left + rect[0]*scale) + 'px';
		    element.style.top = (canvasOffset.top + rect[1]*scale) + 'px';
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
	}
    };
	    /*
            var renderContext = {
		canvasContext: context,
		viewport: viewport
            };
            page.render(renderContext);

            setupAnnotations(page, viewport, canvas, annote, sc);
	});

	function setupAnnotations(page, viewport, canvas, annote, scale) {
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
                    element.style.left = (canvasOffset.left + rect[0] * scale) + 'px';
                    element.style.top = (canvasOffset.top + rect[1] * scale) + 'px';
		    element.style.width = Math.ceil(scale * (rect[2] - rect[0])) + 'px'
		    element.style.height = Math.ceil(scale * (rect[3] - rect[1])) + 'px'
		    element.style.position = 'absolute';
		    

                    var transform = viewport.transform;
                    var transformStr = 'matrix(' + transform.join(',') + ')';
                    CustomStyle.setProp('transform', element, transformStr);
                    var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
                    CustomStyle.setProp('transformOrigin', element, transformOriginStr);

                annote.append(element);
            }
        });
        return promise;
    };
    }
*/
