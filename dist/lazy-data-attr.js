(function(k,f){function g(a,b){a&&"object"===typeof a||(a=[a]);var c=a[0]||a.selector||"[data-src]",d=a[1]||a.threshold||.006;a=a[2]||a.rootMargin||"0px";d="object"===typeof d?d:{threshold:[d],rootMargin:a};var e;"function"!==typeof b&&(b=function(b){for(var a,d=0,e=b.length;d<e;d++)if(a=b[d],!h||a.isIntersecting){var c=h?a.target:a,f=c.getAttribute("data-srcset"),g=c.getAttribute("data-src");f&&(c.srcset=f);g&&(c.src=g);"CustomEvent"in k&&c.dispatchEvent(new CustomEvent("$lazy",{bubbles:!0,cancelable:!0,
detail:{el:c,entry:a}}));h&&h.unobserve(c)}});var h=l?new l(b,d):!1;c instanceof Node?e=[c]:e=c instanceof NodeList?c:f.querySelectorAll(c);d=0;for(a=e.length;d<a;d++)c=e[d],h?h.observe(c):b([c])}var l,b="IntersectionObserverEntry"in k?k.IntersectionObserverEntry.prototype:0;b&&"intersectionRatio"in b&&"isIntersecting"in b&&(l=k.IntersectionObserver);k.$lazy=g;if(b=f.currentScript||f.querySelectorAll("script[data-l]")){(b=b.getAttribute("data-l"))&&0===b.indexOf("||")?b=b.split("||"):b=[b];for(var e,
m=0,n=b.length;m<n;m++){try{e=JSON.parse(b)}catch(a){e=!1}e?g(e):g()}}})(window,document);
