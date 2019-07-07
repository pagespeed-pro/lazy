[![Version](https://img.shields.io/github/release/style-tools/lazy.svg)](https://github.com/style-tools/lazy/releases) [![npm version](https://badge.fury.io/js/%40style.tools%2Flazy.svg)](http://badge.fury.io/js/%40style.tools%2Flazy) [![Latest Stable Version](https://poser.pugx.org/styletools/lazy/v/stable.png)](https://packagist.org/packages/styletools/lazy)

# Lazy Image and Iframe Loader

A lightweight lazy loader based on [Intersection Observer V2](https://developers.google.com/web/updates/2019/02/intersectionobserver-v2) with a tiny fallback for old browsers.

```javascript
$lazy(
   selector, /* string, Node, NodeList or observer config object */
   callback /* optional: custom in-view callback for manual lazy loading */
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

```json
{
   "selector": "[data-src]",
   "threshold": 0.006,
   "rootMargin": "0px"
}
```

#### Custom observer config

```json
{
   "selector": "[data-src]",
   "observer": {
      "threshold": 0.006,
      "rootMargin": "0px",
      "trackVisibility": true,
      "delay": 100
   }
}
```

The array based index config is a compressed format to save size in the HTML document. 

- [0] = selector
- [1] = threshold OR observer config when an object
- [2] = rootMargin

#### Simple config

```json
["[data-src]", 0.006, "0px"]
```

#### Custom observer config

```json
["[data-src]", {
   "threshold": 0.006,
   "rootMargin": "0px",
   "trackVisibility": true,
   "delay": 100
}]
```

## Event

When an element enters the viewport the event `$lazy` is fired on the element. The event contains a reference to the HTML node and the `IntersectionObserverEntry`.

```javascript
// listen for $lazy event on any element
$(document)[0].addEventListener('$lazy', console.log);

// selectively listen for $lazy event on images using jQuery
jQuery('img').on('$lazy', console.log);
```

The event data is available via `event.detail`.

![$lazy event](https://user-images.githubusercontent.com/8843669/60754647-69544100-9fe4-11e9-9c49-07e7fe1c29e8.png)

## Custom callback

When using a custom callback the `$lazy` script essentially functions as a simple in-view solution that can be used for many purposes.

```javascript
$lazy('div#id', function(entries) {
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

## `data-lazy` JSON config

To enable usage in combination with a strict `Content-Security-Policy` the script can be configured using a `data-lazy` attribute on the script source element.


```html
<script data-lazy="{
   &quot;selector&quot;: &quot;[data-src*='cdn.domain.com']&quot;, 
   &quot;observer&quot;: { 
      &quot;threshold&quot;: [1.0],
      &quot;trackVisibility&quot;: true,
      &quot;delay&quot;: 100
   }
}">
// dist/lazy-data-attr.js (source)
</script>
```

Multiple configurations are supported via the special multi-token `||`. The token needs to be included at the begining and each configuration needs to be valid JSON.

`||{config...}||{second config...}`

## Polyfill

`$lazy` includes a [polyfill](https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js) for `IntersectionObserver`. It can be automatically loaded when using [$async](https://github.com/style-tools/async/).

### Example using `$async` with `data-c` based config

```html
<script data-c='[
  {
    "ref": "lazy",
    "src": "dist/lazy-data-attr+polyfill.js",
    "attributes": {
     "data-l": "[\"selector\", 0.006, \"0px\"]"
    },
    "load_timing": "domReady",
    "cache": "localstorage"
  },
  {
    "ref": "lazy-polyfill",
    "src": "dist/intersectionobserver-polyfill.js",
    "load_timing": {
      "type": "method",
      "method": "$lazypoly"
    },
    "cache": "localstorage"
  }
]'>
/* $async IIFE with timing and API module */
</script>
```

In the example, the `$async` timing method `method` defines `window.$lazypoly` which will automatically load the polyfill for browsers that require the polyfill. It used `localStorage` for instant loading.

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

When using `$async` you can alternatively use `window.$lazypoly` with a string or a object to pass to `$async` which could load anything.

Alternatively, when including `$lazy` inline, the `data-poly` attribute enables to define a string to pass to `$async`.

```html
<script data-l='... lazy config ...' data-poly='... config to pass to $async to load polyfill ...'>
// dist/lazy-data-attr+polyfill.js
</script>
```