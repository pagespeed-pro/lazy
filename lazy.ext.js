/*
 * Lazy Image and Iframe Loader
 * /

/** @export */
window.$lazy = function(config, callback) {

    var config = {
        selector: '',
        threshold: '',
        rootMargin: ''
    };

    var callback = function(change) {
        change.isIntersecting = true;
    }
};

window.IntersectionObserver;
window.IntersectionObserverEntry;

