[![Build Status](https://travis-ci.com/style-tools/lazy.svg?branch=master)](https://travis-ci.com/style-tools/lazy) [![Version](https://img.shields.io/github/release/style-tools/lazy.svg)](https://github.com/style-tools/lazy/releases) [![npm version](https://badge.fury.io/js/%40style.tools%2Flazy.svg)](http://badge.fury.io/js/%40style.tools%2Flazy) [![Latest Stable Version](https://poser.pugx.org/styletools/lazy/v/stable.png)](https://packagist.org/packages/styletools/lazy)

# Lazy Image and Iframe Loader

A lightweight lazy loader based on [Intersection Observer V2](https://developers.google.com/web/updates/2019/02/intersectionobserver-v2) with a tiny fallback for old browsers. 

#### Features

- efficient polyfill for old browsers (zero effect on modern browsers)
- `.webp` rewrite with fallback (WebP support for `<img>` tag, saves a server-side redirect)
- `inview` and `out-of-view` callback (persistent observer for advanced element-in-view usage)
- `$lazybg` for lazy loading of `background-image` in stylesheets (CSS-variables)
- tiniest lazy load script `$z()` (300 bytes).

#### Examples

```javascript
$lazy(
   selector, /* string, Node, NodeList or observer config object */
   inview, /* optional: custom in-view callback */
   observer_callback, /* optional: custom observer callback */
   webp /* disable WebP rewrite (when using lazy+webp.js) */
);	
``` 

Lazy loading of `background-image` in stylesheets.

```javascript 
$lazybg(
  sheets, /* stylesheet element(s), default: document.styleSheets (all) */
  lazy_config, /* optional: config to pass to $lazy() */
  resolver, /* optional: JSON or javascript image resolver */
  webp /* disable WebP rewrite (when using lazybg+webp.js) */
);
```

#### Documentation is available on [docs.style.tools/lazy](https://docs.style.tools/lazy).

### Install via npm

```bash
npm install @style.tools/lazy --save
```

### Install via PHP Composer
```bash
composer require styletools/lazy
```

## Config

The `selector` entry accepts multiple configuration formats including a string, an Array, a Node, NodeList or a JSON object with `observer` configuration.

#### Simple config

```javascript
$lazy({
   "selector": "[data-src]",
   "threshold": 0.006,
   "rootMargin": "0px"
});
```

#### Custom observer config

```javascript
$lazy({
   "selector": "[data-src]",
   "observer": {
      "threshold": 0.006,
      "rootMargin": "0px",
      "trackVisibility": true,
      "delay": 100
   }
});
```

The array based index config is a compressed format to save size in the HTML document. 

- [0] = selector
- [1] = threshold OR observer config when an object
- [2] = rootMargin

#### Simple config

```javascript
$lazy(["[data-src]", 0.006, "0px"]);
```

#### Custom observer config

```javascript
$lazy(["[data-src]", {
   "threshold": 0.006,
   "rootMargin": "0px",
   "trackVisibility": true,
   "delay": 100
}]);
```

## Inview & Out-of-view callback

The inview callback makes it possible to use `$lazy` as a simple inview script.

```javascript
$lazy(".selector", function(target, observer, is_inview) {
  
  // element in view
  is_inview = boolean

  return false; // persist observer to enable out-of-view callback
});
```

By returning `false` from a custom inview callback, the observer will not be removed and will trigger the callback again when the element moves in or out of view.

The inview argument accepts an array with 3 index positions:

1. `inview`: a function to call when the element moves into view.
2. `out-of-view` a function to call when the element moves out of view
3. `after_inview` a function to call with the default inview-method after `src` and `srcset` have been rewritten.

When out-of-view is null, the inview method is used as out-of-view method.

```javascript
$lazy(".selector", [
  function inview(target, observer) {
  
    // element in view

    return false; // persist observer
    
  },
  function out_of_view(target, observer) {

    // element out of view

    return false; // persist observer

  }]);
```

To easily extend the original `data-src` based lazy loading of images, you can use an `after_inview` callback.

```javascript
$lazy(".selector", [,,function after_inview(target) {
  
  // target has been lazy-loaded
  target.classList.add('custom-class');
}]);
```

## Custom observer callback

The third argument enables to manually define the `IntersectionObserver` callback.

```javascript
$lazy('div#id', 0, function(entries) {
	// entries is a Array of `IntersectionObserverEntry` or HTML Nodes
	// you need to manually verify if the browser supports Intersection Observer

	if (window.IntersectionObserver) {
		// entries[0] = IntersectionObserverEntry
		// entries[0].target = element
	} else {
		// entries[0] = element
	}
})
```

## Lazy loading of `background-image` in stylesheets

`dist/lazybg.js` enables to lazy load background images in stylesheets. It makes use of [CSS Variables](https://www.w3schools.com/css/css3_variables.asp) with a fallback for old browsers.

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

### Base64 encoded image value

CSS variables are limited to `DOMString`. The following characters need to be replaced in a `base64` encoded value:

`/`: `—` 

`=`: `•`

## Automatic `.webp` rewrite

It is possible to automatically load `.webp` images for browsers that support Google's [WebP](https://developers.google.com/speed/webp/) format. It saves a server-side redirect and it adds WebP support to the `<img>` tag.

Simply use the `dist/lazy+webp...` files to enable it. 

The solution uses `<img onerror>` to fallback to the original image when the `.webp` image is 404.

To manually disable webp rewrites for an image add the HTML attribute `data-webp="no"`. To disable it for a specific `$lazy` configuration, set the 4th argument to `false`.

`$lazybg` supports WebP rewrites by using `dist/lazybg+webp.js`.

## `data-l` JSON config

To enable usage in combination with a strict `Content-Security-Policy` the script can be configured using a `data-l` attribute on the script source element.


```html
<script data-l='{
   "selector": "[data-src*=&apos;cdn.domain.com&apos;]", 
   "observer": { 
      "threshold": [1.0],
      "trackVisibility": true,
      "delay": 100
   }
}'>
// dist/lazy-data-attr.js (source)
</script>
```

Multiple configurations are supported via the special multi-token `||`. The token needs to be included at the begining and each configuration needs to be valid JSON.

`||{config...}||{second config...}`

## Polyfill

`$lazy` includes a [polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js) for `IntersectionObserver`. It can be automatically loaded when using [$async](https://github.com/style-tools/async/).

### Example using `$async` with `data-c` based config

```html
<!-- data-c slot 5 to 8 for $async.js() -->
<script async src="dist/iife-async.js" data-c='[0,0,0,0,{
   "src": "/intersectionobserver-polyfill.js",
   "load_timing": {
      "type": "method",
      "method": "$lazypoly"
    },
    "cache": "localstorage"
},{
   "ref": "lazy",
   "src": "/lazy.js",
   "attributes": {
      "data-l": "[\".selector\", 0.006, \"0px\"]"
   },
    "load_timing": "domReady",
    "cache": "localstorage"
}]'></script>
```

In the example, the `$async` timing method `method` defines `window.$lazypoly` which will automatically load the polyfill for browsers that require the polyfill. It uses `localStorage` for instant loading.

Alternatively, when using `$lazy` without `$async`, you can manually define `window.$lazypoly` with a function that returns a `Promise` or a object containing a `.then` method.

```javascript
window.$lazypoly = function() {

   // load polyfill
   // ...

   return {
      then: function(callback) {

         // wait until polyfill is loaded and resolve callback

         callback();
      }
   }
};
```

When using `$async` you can alternatively use `window.$lazypoly` with a string or a object to pass to `$async.js` which could load anything.

Alternatively, when including `$lazy` inline, the `data-poly` attribute enables to define a string to pass to `$async.js`.

```html
<script data-l='... lazy config ...' data-poly='... config to pass to $async.js to load polyfill ...'>
// dist/lazy-data-attr+polyfill.js
</script>
```

### Example Performance API timings

![$lazy polyfill from localStorage](https://user-images.githubusercontent.com/8843669/60785873-ca028b80-a154-11e9-9a3b-adbc40475aef.png)
