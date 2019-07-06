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

#### Example config

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

### Install via npm

```bash
npm install @style.tools/lazy --save
```

### Install via PHtrackVisibility
```bash
composer require styletools/lazy
```
