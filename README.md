[![Build Status](https://travis-ci.com/style-tools/lazy.svg?branch=master)](https://travis-ci.com/style-tools/lazy) [![Version](https://img.shields.io/github/release/style-tools/lazy.svg)](https://github.com/pagespeed-pro/lazy/releases) [![npm version](https://badge.fury.io/js/%40style.tools%2Flazy.svg)](http://badge.fury.io/js/%40style.tools%2Flazy) [![Latest Stable Version](https://poser.pugx.org/styletools/lazy/v/stable.png)](https://packagist.org/packages/styletools/lazy)

# `$lazy` Lazy Loader

A lightweight and high performance lazy loader and `element-in-view` callback based on [Intersection Observer V2](https://developers.google.com/web/updates/2019/02/intersectionobserver-v2) with an efficient polyfill for old browsers. 

```javascript
// simple: lazy load images
$lazy('[data-src]');

// simple: in-view callback
$lazy('#element', function() {
  // inview callback
});
```

$lazy can be configured using an async script element.

```html
<script async src="dist/lazy+data-attr.js" data-z='selector' data-b='/base/path/'></script>
```

The script element accepts the following parameters:

| Parameter                       | Description     | Type     |
|--------------------------------|-----------------|-----------------|
| `data-z`                |  Selector or config object.  |  `String` 
| `data-zz`                |  Multiple selector or config objects.  |  `Array` 
| `data-b`                |  Base path (URL rebasing) for HTML size compression.  |  `String`

When using [$async](https://github.com/pagespeed-pro/async/), $lazy can be used as a timing method with automated polyfill loading.

```html
<script async src="dist/async.js" data-c='[{
   "src": "dist/intersectionobserver-polyfill.js",
   "load_timing": {
      "type": "method",
      "method": "$lazypoly"
    },
    "cache": "localstorage"
},{
  "ref": "$z",
  "src": "dist/lazy.js",
  "attributes": {
    "data-z": "[\"[data-src]\", 0.006, \"0px\"]"
  },
  "exec_timing": "domReady",
  "cache": "localstorage"
}]'></script>
<!-- timing: requestAnimationFrame @ frame -1 = faster than domready event
```

### Documentation is available on [pagespeed.pro/lazy](https://pagespeed.pro/lazy/#documentation).

# Installation

## Install via npm

```bash
npm install @optimization/lazy --save
```

# Description

$lazy is designed as the ultimate lazy loader and `element-in-view` callback for frontend optimization (FEO). It provides state of the art features such as client-side Google `.webp` rewrite, the absolute best performance and the tiniest HTML footprint. $lazy supports all browsers including iPhone5 and IE9+. IE8 would be supported but isn't supported by Google's [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js).

- 100% JSON control.
- tiny: the `$z()` version is merely 300 bytes in size.
- support for old browsers with a 0% performance hit for modern browsers.

## Advanced control of `IntersectionObserver`

$lazy provides full control of the `IntersectionObserver` and supports the latest features.

```javascript
// simple settings
$lazy({
   "selector": "[data-src]",
   "threshold": 0.006,
   "rootMargin": "0px"
});

// advanced observer config
$lazy({
  "selector": "[data-src]",
  "observer": {
    "threshold": 0.006,
    "rootMargin": "0px",
    "trackVisibility": true,
    "delay": 100
  }
);
```

To save size, the configuration can be provided as an array.

```javascript
// simple settings
$lazy(["[data-src]",0.006,"0px"]);

// advanced observer config
$lazy(["[data-src]",{
  "threshold": 0.006,
  "rootMargin": "0px",
  "trackVisibility": true,
  "delay": 100
}]);
```

$lazy returns a DOM `NodeList` with elements watched by the observer. 

```javascript
var elements = $lazy('[data-src]');
```

## Security

$lazy supports a strict `Content-Security-Policy` and can be controlled by a `async` HTML script tag.

```html
<script async src="dist/lazy+data-attr.js" data-z='{
   "selector": "[data-src]", 
   "observer": { 
      "threshold": [1.0],
      "trackVisibility": true,
      "delay": 100
   }
}'></script>
```

Multiple configurations are supported via the attribute `data-zz`. The attributes accepts a JSON array with configurations.

```html
<script async src="dist/lazy+data-attr.js" data-zz='["selector",{config...},{second config...}]'></script>
```

## Compressed `srcset`

$lazy enables to compress `srcset` to save HTML document size using the attribute `data-z`.

```html
<img src="data:image/gif;base64,R0lGODlhAQABAID/AP///wAAACwAAAAAAQABAAACAkQBADs=" data-z='["path/to/image.jpg",[414,768,1024,1200]]' />
```

## Advanced `in-view` and `out-of-view` callback

$lazy enables to make full use of the `IntersectionObserver` for any purpose and supports a simple `in-view` callback, an `out-of-view` callback or a custom `IntersectionObserver` callback.

```javascript
$lazy(".selector", function() {
  // element in view
});
```

By returning `false` from a custom inview callback, the observer will not be removed and will trigger the callback again when the element moves in or out of view. The third parameter is a boolean with the `in-view` status.

```javascript
$lazy(".selector", function(target, observer, is_inview) {

  if (is_inview) {

    // element is in view
  
  } else {
  
    // element is out of view
  
  }

  return false; // persist observer to enable out-of-view callback
});
```

For advanced usage, the inview argument accepts an array with 3 index positions:

1. `inview`: a function to call when the element moves into view.
2. `out-of-view` a function to call when the element moves out of view
3. `after_inview` a function to call when using the default inview-method (the image resolver) after `src` and `srcset` have been rewritten.

When `out-of-view` is null, the `inview` method is used as the `out-of-view` callback.

```javascript
$lazy(".selector", [
  function inview(target, observer) {
  
    // element is in view

    return false; // persist observer
  },
  function out_of_view(target, observer) {

    // element is out of view

    return false; // persist observer
  }]);
```

The `after_inview` callback enables to easily extend resolved images by the default image resolver.

```javascript
$lazy(".selector", [,,function after_inview(target) {
  
  // target (image) has been lazy-loaded and resolved
  target.classList.add('custom-class');
}]);
```

## Custom `IntersectionObserver` callback

The third argument enables to manually define the `IntersectionObserver` callback which makes it possible to use $lazy for easy access to the functionality provided by `IntersectionObserver`.

```javascript
$lazy('div#id', 0, function(entries) {
  // native IntersectionObserver callback
})
```

## Events

$lazy provides an extension that watches for `mouseover`, `click` and the custom `z` event to fire the in-view callback manually. This feature ensures that images are resolved in the case of issues with the IntersectionObserver polyfill and it enables to manually trigger the callback, for example before printing.

```javascript
// load all images before printing
window.onbeforeprint = function() {

  // get all applicable elements by using an empty inview handler
  var images = $lazy('[data-z]', function() {});

  // fire `z` event on images
  if (images) {
    images.forEach(function(i) {
      try {
            var EventName = 'z';
            if( i.fireEvent ) {
                i.fireEvent( 'on' + EventName );     
            } else {   
                var evObj = document.createEvent( 'Events' );
                evObj.initEvent( EventName, true, false );
                i.dispatchEvent( evObj );
            }
        } catch (e) {

        }
    });
  }
};
```

It is possible to manually define events to watch using the configuration parameter `events` or the array index `4`.

```json
{
  "selector": "[data-src]",
  "events": ["mouseover", "custom-event"]
}
```

## Manually resolve images

$lazy enables to manually resolve images using the default image resolver by providing `1` as the in-view callback.

```javascript
$lazy('[data-src]', 1); // resolve all images
```

## Client-side `.webp` rewrite

$lazy provides an extension to automatically rewrite images to `.webp` in browsers that support Google's [WebP](https://developers.google.com/speed/webp/) image format. The solution prevents a server-side redirect which improves performance.

The solution is fail safe and uses `<img onerror>` as a fallback to the original image when the `.webp` image is 404 or fails to load.

It is possible to manually disable the `.webp` rewrite for an image by defining the HTML attribute `data-webp="no"` or by using the $lazy configuration parameter `webp` or array index `3`.

```json
{
  "selector": "[data-src]",
  "webp": false
}
```

`$lazybg` supports `.webp` rewrites as well.

## `$lazybg` lazy loading of `background-image`

$lazy provides a unique innovation to lazy load `background-image` in stylesheets using [CSS Variables](https://www.w3schools.com/css/css3_variables.asp) with a fallback for old browsers.

There are four options to resolve images:

1. manually define images via `:root {}` within the stylesheet
2. base64 encode image URLs
3. provide a JSON source list as resolver
4. provide a javascript function as resolver

```css
/* :root based pre-configured value */
:root {
  --z--lazy-img: url('/image.jpg');
}
footer {
  background-image: url('/image.jpg'); // old browsers
  background-image: var(--z-lazy-img, none);
}

/* base64 encoded value */
p#out-of-view {
  background-image: url('/image.jpg'); // old browsers
  background-image: var(--z-base64_value, none); /* note: requires character replacements, see documentation */
}

/* JSON object or javascript function based custom resolver */
div#out-of-view {
  background-image: url('/image.jpg'); // old browsers
  background-image: var(--z-custom-resolved, none); 
}
```

```html
<script src="dist/lazybg.js"></script>
<script>
// default: document.styleSheets
$lazybg(); 

// custom $lazy config
$lazybg(
  document.querySelectorAll('link[rel=stylesheet], style#other'),
  {
    observer: {
      threshold: 0,
      rootMargin: '100px'
    }
  }
); 

// custom JSON based resolver
$lazybg(
  0,0, // default config

  // resolver
  {
    "custom-resolved": "url('/image.jpg')"
  }
); 

// custom javascript based resolver
$lazybg(
  0,0, // default config

  // resolver
  function(key) {

    // resolve key "custon-resolved"
    return "url('/"+key+".jpg');"
  }
); 
</script>
```

Note: CSS variables are limited to `DOMString`. When using inline base64 encoding, the following characters need to be replaced in the encoded value:

`/`: `—` 

`=`: `•`

## Polyfill

`$lazy` provides support for Google's [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js) with 0% performance hit for modern browsers.

When using the polyfill extension, `$lazy` checks for the parameter `window.$lazypoly` when IntersectionObserver is not supported by the browser. 

When `window.$lazypoly` is defined as a function, $lazy will fire it and expect a `.then` method to be resolved when the polyfill is loaded.

When `window.$lazypoly` is defined as a string, the string is passed to [$async.js](https://github.com/pagespeed-pro/async/) that could load anything.

```javascript
// manually load a polyfill
window.$lazypoly = function() {

   // load polyfill manually
   // ...

   return {
      then: function(callback) {

         // wait until polyfill is loaded and resolve callback

         callback();
      }
   }
};

// load a polyfill using $async.js
window.$lazypoly = 'dist/intersectionobserver-polyfill.js';
```

## `$lazy` as a timing method in `$async`

$lazy and the polyfill can be efficienty loaded using [$async](https://github.com/pagespeed-pro/async/) and it's `just-in-time` timing method. $lazy then becomes available as a timing method within $async which enables to load stylesheets and scripts using the `IntersectionObserver`.

$async enables to load the `$lazy` script and its optional polyfill from `localStorage` for exceptional speed.

```html
<script async src="dist/async.js" data-c='[{
   "src": "dist/intersectionobserver-polyfill.js",
   "load_timing": {
      "type": "method",
      "method": "$lazypoly"
    },
    "cache": "localstorage"
},{
  "ref": "$z",
  "src": "dist/lazy.js",
  "attributes": {
    "data-z": "[data-src]"
  },
  "exec_timing": "domReady",
  "cache": "localstorage"
}]'></script>
<!-- timing: requestAnimationFrame @ frame -1 = faster than domready event -->
<!-- selector 'z' is a shortcut for data-z -->
```

Note: to use `$lazy` as a timing method in `$async` you need to set the `ref` of the lazy.js script to `$z`.

When including the `$lazy` script inline, the `data-poly` attribute enables to define a string to pass to `$async` to load a polyfill.

```html
<script async src="dist/lazy-data-attr+polyfill.js" data-z='... lazy config ...' data-poly='... config to pass to $async.js to load polyfill ...'></script>
```
