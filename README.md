# Picturefill
A Responsive Images approach that you can use today that mimics the [proposed picture element](http://www.w3.org/TR/2013/WD-html-picture-element-20130226/) using `span`s, for safety sake.


* Author: Scott Jehl (c) 2012
* License: MIT/GPLv2

# Picturefull

This is a fork of Scott Jehl’s [picturefill](https://github.com/scottjehl/picturefill), with the following changes/additions:

* Incorporates @Wilto’s [srcset functionality](https://github.com/scottjehl/picturefill/tree/srcset)
* Incorporates @quoo’s [classname functionality](https://github.com/quoo/picturefill/tree/classname)
* Adds a `data-type` attribute to allow file type switching (WebP and SVG)
* Adds a `data-postpone` attribute to allow for [Resource Priority](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/ResourcePriorities/Overview.html)-style load postponing

## Example

	<span data-picture data-postpone data-class="photo" data-alt="A giant stone face at The Bayon temple in Angkor Thom, Cambodia">

		<!-- WebP content for browsers that support it -->
		<span data-type="image/webp" data-srcset="small.jpg 1x, small_x2.jpg 2x"></span>
		<span data-type="image/webp" data-srcset="medium.jpg 1x, medium_x2.jpg 2x"			data-media="(min-width: 400px)"></span>
		<span data-type="image/webp" data-srcset="large.jpg 1x, large_x2.jpg 2x"			data-media="(min-width: 800px)"></span>
		<span data-type="image/webp" data-srcset="extralarge.jpg 1x, extralarge_x2.jpg 2x"	data-media="(min-width: 1000px)"></span>

		<!-- JPEG content for browsers that don't support WebP -->
		<span data-srcset="small.jpg 1x, small_x2.jpg 2x"></span>
		<span data-srcset="medium.jpg 1x, medium_x2.jpg 2x"			data-media="(min-width: 400px)"></span>
		<span data-srcset="large.jpg 1x, large_x2.jpg 2x"			data-media="(min-width: 800px)"></span>
		<span data-srcset="extralarge.jpg 1x, extralarge_x2.jpg 2x"	data-media="(min-width: 1000px)"></span>

		<!-- Fallback content for non-JS browsers. Same img src as the initial, unqualified source element. -->
		<noscript>
			<img src="external/imgs/small.jpg" alt="A giant stone face at The Bayon temple in Angkor Thom, Cambodia">
		</noscript>

	</span>