[![Build Status](https://travis-ci.com/style-tools/lazy.svg?branch=master)](https://travis-ci.com/style-tools/lazy) [![Version](https://img.shields.io/github/release/style-tools/lazy.svg)](https://github.com/style-tools/lazy/releases) [![npm version](https://badge.fury.io/js/%40style.tools%2Flazy.svg)](http://badge.fury.io/js/%40style.tools%2Flazy) [![Latest Stable Version](https://poser.pugx.org/styletools/lazy/v/stable.png)](https://packagist.org/packages/styletools/lazy)

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

Documentation is available on [docs.style.tools/lazy](https://docs.style.tools/lazy).

### Install via npm

```bash
npm install @style.tools/lazy --save
```

### Install via PHP Composer
```bash
composer require styletools/lazy
```

## Description

$lazy is designed as the ultimate lazy loader and `element-in-view` callback for modern frontend optimization (FEO). It provides state of the art features, the absolute best performance and the tiniest HTML footprint. $lazy supports all browsers including iPhone5 and IE9+. IE8 would be supported but isn't supported by Google's [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js).

- 100% JSON controlled.
- tiny: the `$z()` version is merely 300 bytes in size.
- support for old browsers with a 0% performance hit for modern browsers.

### Advanced control of `IntersectionObserver`

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

### Advanced `in-view` and `out-of-view` callback

$lazy enables to make full use of the `IntersectionObserver` for any purpose and supports a simple `in-view` callback, a `out-of-view` callback or a custom `IntersectionObserver` callback.

```javascript
$lazy(".selector", function() {
  // element in view
});
```

By returning `false` from a custom inview callback, the observer will not be removed and will trigger the callback again when the element moves in or out of view. The third parameter is a boolean with the `in-view` status.

```javascript
$lazy(".selector", function(target, observer, is_inview) {

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

### Custom `IntersectionObserver` callback

The third argument enables to manually define the `IntersectionObserver` callback which makes it possible to use $lazy for easy access to the functionality provided by `IntersectionObserver`.

```javascript
$lazy('div#id', 0, function(entries) {
  // native IntersectionObserver callback
})
```

### Events

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

### Manually resolve images

$lazy enables to manually resolve images using the default image resolver by providing `1` as the in-view callback.

```javascript
$lazy('[data-src]', 1); // resolve all images
```

### `.webp` rewrite

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

### `$lazybg` lazy loading of `background-image`

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

### Security

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

Multiple configurations are supported via the special multi-token `||`. The token needs to be included at the begining and each configuration needs to be valid JSON.

`||{config...}||{second config...}`

### Polyfill

`$lazy` provides support for Google's [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js) with 0% performance hit for modern browsers.

When using the polyfill extension, `$lazy` checks for the parameter `window.$lazypoly` when IntersectionObserver is not supported by the browser. 

When `window.$lazypoly` is defined as a function, $lazy will fire it and expect a `.then` method to be resolved when the polyfill is loaded.

When `window.$lazypoly` is defined as a string, the string is passed to [$async.js](https://github.com/style-tools/async/) that could load anything.

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

### `$lazy` as a timing method in `$async`

$lazy and the polyfill can be efficienty loaded using [$async](https://github.com/style-tools/async/) and it's `just-in-time` timing method. $lazy then becomes available as timing method within $async.

$async enables to load the `$lazy` script and its optional polyfill from `localStorage` for exceptional speed.

```html
<!-- data-c slot 5 to 8 for $async.js() -->
<script async src="dist/async.js" data-c='[0,0,0,0,{
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
    "data-z": "[\".selector\", 0.006, \"0px\"]"
  },
  "load_timing": "domReady",
  "cache": "localstorage"
}]'></script>
```

Note: to use `$lazy` as timing method in `$async` you need to set the `ref` of the lazy.js script to `$z`.

When including the `$lazy` script inline, the `data-poly` attribute enables to define a string to pass to `$async.js` to load a polyfill.

```html
<script data-z='... lazy config ...' data-poly='... config to pass to $async.js to load polyfill ...'>
// dist/lazy-data-attr+polyfill.js
</script>
```



### Example Performance API timings

![$lazy polyfill from localStorage](https://user-images.githubusercontent.com/8843669/60785873-ca028b80-a154-11e9-9a3b-adbc40475aef.png)
