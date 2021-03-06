(function($) {
  Drupal.behaviors.islandoraOpenSeadragon = {
    attach: function(context, settings) {
      var resourceUri = settings.islandoraOpenSeadragon.resourceUri;
      var config = settings.islandoraOpenSeadragon.settings;
      var openSeadragonId = '#' + config['id'];
      $(openSeadragonId).each(function () {
        if (!$(this).hasClass('processed')) {
          config.tileSources = new Array();
          resourceUri = (resourceUri instanceof Array) ? resourceUri : new Array(resourceUri);
          $.each(resourceUri, function(index, uri) {
            var tileSource = new OpenSeadragon.DjatokaTileSource(uri, settings.islandoraOpenSeadragon);
            config.tileSources.push(tileSource);
          });

	  /**
	   * @author griffinj@lafayette.edu
	   * Work-around for scrolling
	   *
	   */
	  config.zoomPerScroll = 1;

	  /**
	   * @author griffinj@lafayette.edu
	   *
	   */
	  /*
            navImages: {
                zoomIn: {
                    REST:   '/images/zoomin_rest.png',
                    GROUP:  '/images/zoomin_grouphover.png',
                    HOVER:  '/images/zoomin_hover.png',
                    DOWN:   '/images/zoomin_pressed.png'
                },
                zoomOut: {
                    REST:   '/images/zoomout_rest.png',
                    GROUP:  '/images/zoomout_grouphover.png',
                    HOVER:  '/images/zoomout_hover.png',
                    DOWN:   '/images/zoomout_pressed.png'
                },
                home: {
                    REST:   '/images/home_rest.png',
                    GROUP:  '/images/home_grouphover.png',
                    HOVER:  '/images/home_hover.png',
                    DOWN:   '/images/home_pressed.png'
                },
                fullpage: {
                    REST:   '/images/fullpage_rest.png',
                    GROUP:  '/images/fullpage_grouphover.png',
                    HOVER:  '/images/fullpage_hover.png',
                    DOWN:   '/images/fullpage_pressed.png'
                },
                previous: {
                    REST:   '/images/previous_rest.png',
                    GROUP:  '/images/previous_grouphover.png',
                    HOVER:  '/images/previous_hover.png',
                    DOWN:   '/images/previous_pressed.png'
                },
                next: {
                    REST:   '/images/next_rest.png',
                    GROUP:  '/images/next_grouphover.png',
                    HOVER:  '/images/next_hover.png',
                    DOWN:   '/images/next_pressed.png'
	        },
			/**
			 * @author griffinj@lafayette.edu
			 * /
		download: {
		    REST:   '/images/download_rest.png',
                    GROUP:  '/images/fullpage_grouphover.png',
                    HOVER:  '/images/fullpage_hover.png',
                    DOWN:   '/images/fullpage_pressed.png'
                },
	  */

	  config = $.extend(config, {

		  navImages: {

		      zoomIn: {
			  REST:   '/images/zoomin_ImageIcon.png',
			  GROUP:   '/images/zoomin_ImageIcon.png',
			  HOVER:   '/images/zoomin_ImageIcon.png',
			  DOWN:   '/images/zoomin_ImageIcon.png',
		      },
		      zoomOut: {
			  REST:   '/images/zoomout_ImageIcon.png',
			  GROUP:   '/images/zoomout_ImageIcon.png',
			  HOVER:   '/images/zoomout_ImageIcon.png',
			  DOWN:   '/images/zoomout_ImageIcon.png',
		      },
		      home: {
			  REST:   '/images/home_ImageIcon.png',
			  GROUP:   '/images/home_ImageIcon.png',
			  HOVER:   '/images/home_ImageIcon.png',
			  DOWN:   '/images/home_ImageIcon.png',
		      },
		      fullpage: {
			  REST:   '/images/fullpage_ImageIcon.png',
			  GROUP:   '/images/fullpage_ImageIcon.png',
			  HOVER:   '/images/fullpage_ImageIcon.png',
			  DOWN:   '/images/fullpage_ImageIcon.png',
		      },
		      download: {
			  REST:   '/images/download_ImageIcon.png',
			  GROUP:   '/images/download_ImageIcon.png',
			  HOVER:   '/images/download_ImageIcon.png',
			  DOWN:   '/images/download_ImageIcon.png',
		      },
		  }
	      });

          var viewer = new OpenSeadragon(config);

	  /**
	   * @author griffinj@lafayette.edu
	   *
	   * Work-around for styling
	   *
	   */

	  $(viewer.element).find('form div').addClass('openseadragon-controls-container');
	  $($(viewer.element).find('form div')[1]).attr('id', 'openseadragon-size-transform-container');

	  /**
	   * @author griffinj@lafayette.edu
	   *
	   * Work-around for updating size controls upon rendering the image as a full-screen image
	   *
	   */

          //viewer.addHandler('pre-full-screen', function(event) {
	  $('#openseadragon-size-transform-container span fieldgroup button:nth-of-type(4)').click(function(e) {

		  var img = $(this).find('img');

		  if(/fullpage/.exec( img.attr('src'))) {

		      img.attr('src', '/sites/all/libraries/openseadragon/images/reducepage_ImageIcon.png');
		  } else {
		      
		      img.attr('src', '/sites/all/libraries/openseadragon/images/fullpage_ImageIcon.png');
		  }

		  /*
		  if(event.fullScreen) {

		      $(eventSource.element).find('#openseadragon-size-transform-container span fieldgroup button:nth-of-type(4) img').attr('src', '/images/reducepage_ImageIcon.png');
		  } else {

		      $(eventSource.element).find('#openseadragon-size-transform-container span fieldgroup button:nth-of-type(4) img').attr('src', '/images/fullpage_ImageIcon.png');
		  }
		  */
	      });

          var update_clip = function(viewer) {
            var fitWithinBoundingBox = function(d, max) {
              if (d.width/d.height > max.x/max.y) {
                return new OpenSeadragon.Point(max.x, parseInt(d.height * max.x/d.width));
              } else {
                return new OpenSeadragon.Point(parseInt(d.width * max.y/d.height),max.y);
              }
            }
            var getDisplayRegion = function(viewer, source) {
              // Determine portion of scaled image that is being displayed.
              var box = new OpenSeadragon.Rect(0, 0, source.x, source.y);
              var container = viewer.viewport.getContainerSize();
              var bounds = viewer.viewport.getBounds();
              // If image is offset to the left.
              if (bounds.x > 0){
                box.x = box.x - viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0,0)).x;
              }
              // If full image doesn't fit.
              if (box.x + source.x > container.x) {
                box.width = container.x - viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0,0)).x;
                if (box.width > container.x) {
                  box.width = container.x;
                }
              }
              // If image is offset up.
              if (bounds.y > 0) {
                box.y = box.y - viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0,0)).y;
              }
              // If full image doesn't fit.
              if (box.y + source.y > container.y) {
                box.height = container.y - viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0,0)).y;
                if (box.height > container.y) {
                  box.height = container.y;
                }
              }
              return box;
            }
            var source = viewer.source;
            var zoom = viewer.viewport.getZoom();
            var size = new OpenSeadragon.Rect(0, 0, source.dimensions.x, source.dimensions.y);
            var container = viewer.viewport.getContainerSize();
            var fit_source = fitWithinBoundingBox(size, container);
            var total_zoom = fit_source.x/source.dimensions.x;
            var container_zoom = fit_source.x/container.x;
            var level = (zoom * total_zoom) / container_zoom;
            var box = getDisplayRegion(viewer, new OpenSeadragon.Point(parseInt(source.dimensions.x*level), parseInt(source.dimensions.y*level)));
            var scaled_box = new OpenSeadragon.Rect(parseInt(box.x/level), parseInt(box.y/level), parseInt(box.width/level), parseInt(box.height/level));
            var params = {
              'url_ver': 'Z39.88-2004',
              'rft_id': source.imageID,
              'svc_id': 'info:lanl-repo/svc/getRegion',
              'svc_val_fmt': 'info:ofi/fmt:kev:mtx:jpeg2000',
              'svc.format': 'image/jpeg',
              'svc.region': scaled_box.y + ',' + scaled_box.x + ',' + (scaled_box.getBottomRight().y - scaled_box.y) + ',' + (scaled_box.getBottomRight().x - scaled_box.x),
            };
	    /**
	     * @author griffinj
	     * Work-around for HTTPS and XSRF
	     *

	     jQuery("#clip").attr('href',  Drupal.settings.basePath + 'islandora/object/' + settings.islandoraOpenSeadragon.pid + '/print?' + jQuery.param({
	     */
	    jQuery("#clip").attr('href',  Drupal.settings.basePath.replace(/^https/, 'http') + 'islandora/object/' + settings.islandoraOpenSeadragon.pid + '/print?' + jQuery.param({
              'clip': source.baseURL + '?' + jQuery.param(params),
              'dimensions': container.x + ',' + container.y,
            }));
          };
          viewer.addHandler("open", update_clip);
          viewer.addHandler("animationfinish", update_clip);
          $(this).addClass('processed');
        }

	/**
	 * @griffinj
	 * Accessing the Object within the global Drupal scope...
	 * @author griffinj
	 * (Integration with HTML5)
	 * Handling the back button
	 */
	window.onpopstate = function() {

	    if(!this.location.pathname.match(/#fullPage$/)) {

		viewer.setFullPage(false);
	    }
	};
      });
    }
  };
})(jQuery);
