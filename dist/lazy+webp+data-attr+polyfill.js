(function(b,n,t){function h(c,a){return c.getAttribute("data-"+a)}function e(c,a,d){c&&"string"!=typeof c&&(c instanceof Array||c.selector)||(c=[c]);var b=c[0]||c.selector||"[data-src]",e=c[1]||c.threshold||c.observer,u=c[2]||c.rootMargin,f;e="object"==typeof e?e:{rootMargin:u||"0px",threshold:e||0};var k=!1===c[3]||!1===c.a?!1:!0;if(a instanceof Array){var l=a[2];var p=a[1];a=a[0];p=p||a}a=a||function(c,a,b){b=h(c,"srcset");a=h(c,"src");b&&(k&&(b=q(b,c)),c.srcset=b);a&&(k&&(a=q(a,c)),c.src=a);l&&
l(c)};d=d||function(c){for(var b,d,e=0,f=c.length;e<f;e++)if(b=c[e],(d=!g||b.isIntersecting)||p)b=g?b.target:b,d=(d?a:p)(b,g,d),g&&!1!==d&&g.unobserve(b)};var g=m?new m(d,e):!1;"string"==typeof b?f=n.querySelectorAll(b):f=b&&b.length==t?[b]:b;b=0;for(e=f.length;b<e;b++)c=f[b],g?g.observe(c):d([c]);return f}function v(c,a){r.push([c,a])}var m,d="IntersectionObserverEntry"in b?b.IntersectionObserverEntry.prototype:0;d&&"intersectionRatio"in d&&"isIntersecting"in d&&(m=b.IntersectionObserver);b.$lazy=
e;d=new Image;d.onload=d.onerror=function(){};d.src="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";var k,w=/(\.(jp(e)?g|gif|bmp|png|tiff))/ig;var q=function(c,a,b){k||(k=h(n.body,"webp")||".webp");if(a&&(b=h(a,"webp"),"no"==b))return c;b=b?b:k;a&&(a.onerror=function(){this.src=c});return c.replace(w,b)};b.$zwebp=q;var a;d=n.currentScript||n.querySelectorAll("script[data-l]")[0];var r=[];if(!m&&(b.$lazypoly?a=b.$lazypoly:d&&(a=h(d,
"poly")),a)){var x=e;b.$lazy=e=v;"function"==typeof a&&(a=a());("string"!=typeof a&&"then"in a?a:$async.js(a)).then(function(){m=b.IntersectionObserver;b.$lazy=e=x;for(var a;a=r.shift();)e(a[0],a[1])})}if(d){(a=h(d,"l"))&&0===a.indexOf("||")?a=a.split("||"):a=[a];d=0;for(var y=a.length;d<y;d++){try{var l=JSON.parse(a[d])}catch(c){l=!1}l?e(l):e()}}})(window,document);
