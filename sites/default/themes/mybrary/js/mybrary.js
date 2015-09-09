var Drupal = Drupal || { 'settings' : {}, 'behaviors' : {}, 'locale' : {} };

//console.log(Drupal);

(function($, Drupal){
	"use strict";

	// define mybrary shared properties and functions
	Drupal.mybrary = {
		// this is the threshold value to determine desktop or mobile, change this needs to change css accordingly
		screenMin: 992, 
		
		getWindowWidth: function() {
			//check window width (scrollbar included)
			var e = window, 
		        a = 'inner';
		    if (!('innerWidth' in window )) {
		        a = 'client';
		        e = document.documentElement || document.body;
		    }
		    
		    return e[ a+'Width' ];
		},
		
		getWindowHeight: function() {
			//check window height (scrollbar included)
			var e = window, 
		        a = 'inner';
		    if (!('innerHeight' in window )) {
		        a = 'client';
		        e = document.documentElement || document.body;
		    }
		    
		    return e[ a+'Height' ];
		},
		
		checkWindowWidth: function() {
		    if ( Drupal.mybrary.getWindowWidth() >= Drupal.mybrary.screenMin ) {
				return true;
			} else {
				return false;
			}
		}

	};
    
    Drupal.behaviors.mybrary = {
		attach: function(context, settings) {
			//avoid initialize twice due to ajax call
			if (settings.mybrary && settings.mybrary.initialized)
				return;
			
			if (typeof settings.mybrary == 'undefined')
				settings.mybrary = {};
			
			/*!
			 * IE10 viewport hack for Surface/desktop Windows 8 bug
			 * Copyright 2014-2015 Twitter, Inc.
			 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
			 */

			// See the Getting Started docs for more information:
			// http://getbootstrap.com/getting-started/#support-ie10-width
			if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
				var msViewportStyle = document.createElement('style')
				msViewportStyle.appendChild(
					document.createTextNode(
						'@-ms-viewport{width:auto!important}'
					)
				)
				document.querySelector('head').appendChild(msViewportStyle)
			}			
			
            settings.mybrary.initialized = true;
	    }
	};
    
    /**
     * Extend jQuery functions 
     */
    
    // ajax load and execute the callback or set the html by default.
    // response is a json structure {'status': 'error or success', 'html': 'html to display'}
    $.fn.extend({
    	loadContent: function (url, params, successCallback, errorCallback, beforeCallback) {
        	var $target = this;
        	
    	    $.ajax({
    	        type: "GET",
    	        url: Drupal.settings['basePath'] + url,
    	        data: params, 
    	        beforeSend: function( jqXHR, settings ) {
	        		if ($.isFunction(beforeCallback)) {
	        			var func = $.proxy(beforeCallback, $target);
	        			func (jqXHR, settings);
	        		} else {
		        		$target.html('<div class="center-block"><i class="fa fa-spinner fa-pulse"></i></div>');
	        		}
    	        },
    	        success: function (response, textStatus, jqXHR) {
	        		if ($.isFunction(successCallback)) {
	        			var func = $.proxy(successCallback, $target);
	        			func (response, textStatus, jqXHR);
	        		} else {
	        			$target.html(response.html);
	        		}
    	        },
    	        error: function (jqXHR, textStatus, errorThrown) {
	        		if ($.isFunction(errorCallback)) {
	        			var func = $.proxy(errorCallback, $target);
	        			func (jqXHR, textStatus, errorThrown);
	        		} else {
	        			$target.html(errorThrown);
	        		}
    	        }
    	    });
    	}
    });
    
})(jQuery, Drupal);