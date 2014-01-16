/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){

	// Enable strict mode
	"use strict";

	w.picturescroll = function() {
		var ps = w.document.getElementsByTagName( "span" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-picture" ) !== null &&
				ps[ i ].getAttribute( "data-postpone" ) !== null &&
				(
					(
						ps[ i ].className !== "" &&
						new RegExp("(^|\\s)loaded(\\s|$)").test(ps[ i ].className === false)
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
					matches = [];

				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "data-media" );
					// if there's no media specified, OR w.matchMedia is supported
					if( !media || ( w.matchMedia && w.matchMedia( media ).matches ) ){
						matches.push( sources[ j ] );
					}
				}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

			if( matches.length ){
				var matchedEl = matches.pop();
				if( !picImg || picImg.parentNode.nodeName === "NOSCRIPT" ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "data-alt" );
				}
				else if( matchedEl === picImg.parentNode ){
					// Skip further actions if the correct image is already in place
					continue;
				}

				picImg.src =  matchedEl.getAttribute( "data-src" );
				matchedEl.appendChild( picImg );
				picImg.removeAttribute("width");
				picImg.removeAttribute("height");
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
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
		w.addEventListener( "scroll", w.picturescroll, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
		w.attachEvent( "onscroll", w.picturescroll );
	}

}( this ));
