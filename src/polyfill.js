// PolyFill for "isIntersecting"
// https://github.com/WICG/IntersectionObserver/issues/211#issuecomment-309144669
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype &&
    !('isIntersecting' in IntersectionObserverEntry.prototype)) {

    Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function () {
            return this.intersectionRatio > 0
        }
    })
}