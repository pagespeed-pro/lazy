/*
 * Lazy Image and Iframe Loader
 */


/** @export */
window.$lazy = function(config, callback) {

    config = {
        selector: '',
        threshold: '',
        rootMargin: '',
        observer: '',
        webp: '',
        events: ''
    };

    callback = function(change) {
        change.isIntersecting = true;
    }
};
var $lazy = window.$lazy;

/** @export */
window.$z = window.$lazy; // tiny

/** @export */
window.$lazybg = function(sheets, lazy_config, resolver) {

    sheets = {
        sheet: {
            cssRules: [
                {
                    style: {
                        backgroundImage: ''
                    }
                }
            ]
        }
    }

    resolver = function(data) {
        
    }

    lazy_config = {
        selector: '',
        observer: '',
        threshold: '',
        rootMargin: ''
    }
};

/** @export */
window.$zwebp = function(src) {
    src = '';
}

var $zwebp = window.$zwebp;

window.IntersectionObserver;
window.IntersectionObserverEntry;
window.IntersectionObserverEntry.prototype;
window.IntersectionObserverEntry.prototype.intersectionRatio;
window.IntersectionObserverEntry.prototype.isIntersecting;

CustomEvent = function(selector, config) {
	config = {
	    bubbles: true,
	    cancelable: true,
	    detail: {
	        el: '',
	        entry: ''
	    }
	};
};

window.$lazypoly = function() {}

function $async() {
    return {
        js: function() {
            return {
                then: function() {
                    
                }
            }
        }
    }
};