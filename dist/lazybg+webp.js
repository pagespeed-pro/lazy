(function(r,e,t){function u(b,v,d,f,a){c||(c=e.createElement("style"),c.id="$lazybg",a=e.head,a.insertBefore(c,a.firstChild));requestAnimationFrame(function(){try{d=c.sheet,d.insertRule(":root { --z-"+b+": "+v+"; }",d.cssRules.length)}catch(g){}})}function p(b,c,d,f){b||(b=e.styleSheets);f==t&&(f=!0);"function"!=typeof d&&(d=function(h){return function(b){if(h&&b in h)a=h[b];else{l||(l=getComputedStyle(w));var a=l.getPropertyValue("--z--"+b);if(!a)try{a=atob(b.replace(/\u2022/g,"=").replace(/\u2014/g,
"/"))}catch(y){}}f&&(a=$zwebp(a));return a}}(d));if(b.length)for(var a=0,g=b.length;a<g;a++)b[a]&&p(b[a],c,d);else try{b.sheet&&(b=b.sheet);var m=b.cssRules,k,n,q;if(m)for(a=0,g=m.length;a<g;a++)(k=m[a])&&k.style&&(n=k.style.backgroundImage)&&-1!==n.indexOf("--z-")&&(q=n.match(x))&&function(a,b,c,e,f){e=d(c);a?(a=JSON.parse(JSON.stringify(a)),a instanceof Array?a[0]=b:a.selector=b):a=b;$lazy(a,function(){f||(f=1,u(c,e))})}(c,k.selectorText,q[1])}catch(h){}}var x=/var\s*\(\s*--z-([^,\s]+)[,|\s]/,w=
e.documentElement,l,c;r.$lazybg=p})(window,document);
