/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){

	// Enable strict mode
	"use strict";

	w.types = {};

	w.picturedetect = function() {
		// based on Modernizr's inlinesvg test
		// https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
		var ns = {'svg': 'http://www.w3.org/2000/svg'},
			div = document.createElement( "div" );
		div.innerHTML = "<svg/>";
		if( ( div.firstChild && div.firstChild.namespaceURI ) == ns.svg ){
			w.types['image/svg+xml'] = true;
		}

		// based on Modernizr's img-webp test
		// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img-webp.js
		// note: asynchronous
		var image = new Image();
		image.onload = function() {
			if( image.width == 1 ){
				w.types['image/webp'] = true;
			}
		};
		image.src = "data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==";

		// Race condition! WebP detect is asynchronous, the setTimeout
		// should allow it to finish before picturefill runs
		setTimeout(w.picturefill, 100);
	};

	w.picturescroll = function() {
		var ps = w.document.getElementsByTagName( "span" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-picture" ) !== null &&
				ps[ i ].getAttribute( "data-postpone" ) !== null &&
				(
					(
						ps[ i ].className !== "" &&
						new RegExp("(^|\\s)loaded(\\s|$)").test(ps[ i ].className) === false
					) ||
					ps[ i ].className === ""
				) &&
				imgVisible(ps[ i ]) ) {

				w.picturefill();
				break;
			}
		}
	};

	w.picturefill = function() {
		var ps = w.document.getElementsByTagName( "span" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-picture" ) !== null &&
				(ps[ i ].getAttribute( "data-postpone" ) === null || imgVisible(ps[ i ]))){

				var sources = ps[ i ].getElementsByTagName( "span" ),
					matches = [],
					lastType;

				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "data-media" ),
						type = sources[ j ].getAttribute("data-type");

					// stop once type changes if we've already found matches
					if( matches.length && type != lastType ){
						break;
					}

					// if there's no type OR the type is in w.types
					if (!type || ( w.types[type] === true) ){

						// if there's no media specified, OR w.matchMedia is supported
						if( !media || ( w.matchMedia && w.matchMedia( media ).matches ) ){
							matches.push( sources[ j ] );
						}
					}

					lastType = type;
				}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

			if( matches.length ){
				var matchedEl = matches.pop(),
					srcset = "srcset" in w.picturefill && w.picturefill.srcset( matchedEl );

				if( !picImg || picImg.parentNode.nodeName === "NOSCRIPT" ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "data-alt" );
					picImg.className = ps[ i ].getAttribute( "data-class" );
				}
				else if( matchedEl === picImg.parentNode ){
					// Skip further actions if the correct image is already in place
					continue;
				}

				if( srcset && ( "srcset" in w.picturefill && w.picturefill.srcset.supported ) ) {
					picImg.srcset = srcset;
				} else {
					picImg.src = srcset || matchedEl.getAttribute( "data-src" );
				}
				matchedEl.appendChild( picImg );
				picImg.removeAttribute("width");
				picImg.removeAttribute("height");

				// add a loaded class to the parent
				if( picImg.addEventListener ){
					picImg.addEventListener( "load", function(){
						this.parentNode.parentNode.className = this.parentNode.parentNode.className + ' loaded';
					}, false );
				}
				else if( picImg.attachEvent ){
					picImg.attachEvent("onload", function() {
						this.parentNode.parentNode.className = this.parentNode.parentNode.className + ' loaded';
					});
				}
			}
			else if( picImg ){
				picImg.parentNode.removeChild( picImg );
			}
		}
		}
	};

	function imgVisible(el) {
		var box = el.getBoundingClientRect();
		return (
			(
				(box.top >= 0 || box.bottom >= 0) &&
				(box.left >= 0 || box.right >= 0)
			) && (
				box.top <= (window.innerHeight || document.documentElement.clientHeight) ||
				box.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			)
		);
	}


	// Run on resize and domready (w.load as a fallback)
	// Also, because of `postpone`, run on scroll
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturedetect();
			// Run once only
			w.removeEventListener( "load", w.picturedetect, false );
		}, false );
		w.addEventListener( "load", w.picturedetect, false );
		w.addEventListener( "scroll", w.picturescroll, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturedetect );
		w.attachEvent( "onscroll", w.picturescroll );
	}

}( this ));
