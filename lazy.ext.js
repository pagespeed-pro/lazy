/*
 * Lazy Image and Iframe Loader
 * /

/** @export */
window.$lazy = function(config, callback) {

    config = {
        selector: '',
        threshold: '',
        rootMargin: '',
        observer: ''
    };

    callback = function(change) {
        change.isIntersecting = true;
    }
};

window.IntersectionObserver;
window.IntersectionObserverEntry;

CustomEvent = function(selector, config) {
	config = {
	    bubbles: true,
	    cancelable: true,
	    detail: {
	        el: '',
	        entry: ''
	    }
	};
}