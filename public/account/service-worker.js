"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/account/css/app.f7c92f1d.css","f7c92f1d7450ad65d123a39f91705da7"],["/account/index.html","2af6959674208a1b5f5c7765260ab20e"],["/account/media/Gotham-Bold.46e967b8.ttf","46e967b815ca51f5f3d477f178662f51"],["/account/media/hlr.4f91dc55.ttf","4f91dc5563bf4a9bcd4fe85b2a4c6079"],["/account/media/hlr.83ce805c.eot","83ce805c2c97d524a0cbcc1fa7f7cc74"],["/account/media/hlr.df08d1ee.svg","df08d1ee47851db725787c563779012a"],["/account/media/hlr.f2044a59.woff","f2044a59623d2ffceac181b8ad26fe6b"],["/account/media/impact.3279b076.eot","3279b076428283066f4ca1b0666b13f8"],["/account/media/impact.6e8f2064.woff","6e8f2064ee27a4a618d34e773549ab6e"],["/account/media/impact.cbd325b6.ttf","cbd325b67a3406899c970e9f36d561b7"],["/account/media/impact.f76d727c.svg","f76d727c741902ca6228956698d64ec2"],["/account/media/index.00b66c23.less","00b66c23bbb239a6c660ac4561277f18"],["/account/media/index.0c852203.less","0c85220371c838dec961371d47b4a2af"],["/account/media/index.19368174.less","19368174fdbd7258b58d2282bc16749b"],["/account/media/index.1b7a7577.less","1b7a7577a10404bb3222858f94f8c61d"],["/account/media/index.22cfa8e2.less","22cfa8e2e13b9c4b48e8b39fcee1cf47"],["/account/media/index.277084dd.less","277084dd9f5d9515823a876082997b85"],["/account/media/index.2998f15e.less","2998f15ea8770703140df2f0a5f130f9"],["/account/media/index.2aa5459a.less","2aa5459a70c807319921f47b6ea021d8"],["/account/media/index.2f98f7d5.less","2f98f7d59f53d8ea8ed9311d03b26168"],["/account/media/index.3d40ce26.less","3d40ce26b69530f16eb1d636ace5038b"],["/account/media/index.3f834594.less","3f834594ac2e2e5d0f21b6153a0d017a"],["/account/media/index.4b0e8641.less","4b0e8641e3fbd10617e38a94bf5b6210"],["/account/media/index.5c904c7d.less","5c904c7ddd7475dd66daf90602ee0d48"],["/account/media/index.62567c9e.less","62567c9eedd64668613636d7e2b810aa"],["/account/media/index.687ed6ab.less","687ed6ab4232a44bc792cd0b840f7418"],["/account/media/index.7597cf63.less","7597cf632d1a4d13f541751b366f0428"],["/account/media/index.77747353.less","77747353a5c103a6423f7a67c9e846ee"],["/account/media/index.85080bfd.less","85080bfdde750fb3208fc916fd8d21a7"],["/account/media/index.93ed363f.less","93ed363f9063f087682f2c97d29d2473"],["/account/media/index.958a84fe.less","958a84fe7384b1f897ea72814b749b4b"],["/account/media/index.9b5806a4.less","9b5806a4034c51afdbadf58025b9c3d5"],["/account/media/index.a541ca5b.less","a541ca5be25d575c174e9ffdc69ed9bd"],["/account/media/index.ad40a8aa.less","ad40a8aaf2fd0aa36c1940970c684560"],["/account/media/index.c7b73e63.less","c7b73e6364bcce2a472401d049235f1a"],["/account/media/index.c92ff6e8.less","c92ff6e8c060023b0b57ca6df21c8ab7"],["/account/media/index.c9ea049e.less","c9ea049e82be19a0252d655e743c624f"],["/account/media/index.cdbeefbc.less","cdbeefbc84e4c4a4cad6d75bfbdcd6a2"],["/account/media/index.cdcf9d91.less","cdcf9d91ad1b654e62697e23fd6082cb"],["/account/media/index.d4f81e15.less","d4f81e15bd33fa51fb958cdc762ed926"],["/account/media/index.dbfa5261.less","dbfa5261f8aa39cecaa15ea68c2bbf90"],["/account/media/index.ed154b2f.less","ed154b2f4dfc87fa09c299d5a7130aa5"],["/account/media/index.ef94b696.less","ef94b69600d0ac7c3d711946a3560bd6"],["/account/media/index.fbc4bf0e.less","fbc4bf0eb46317a4078ad2858df02362"],["/account/media/info.7f139925.png","7f139925d877a3214d2fc177e7c70ff2"],["/account/media/invoice-normal-red.6a4f3579.png","6a4f3579254a1acc7d50811e8e8856a0"],["/account/media/invoice-normal.71a890d3.png","71a890d3694542fd091001b108ad0536"],["/account/media/invoice.dd498fc2.png","dd498fc27dc603c94594b41fdd107792"],["/account/media/loginbg.7e7d8bc2.jpg","7e7d8bc2eb6049348b3002b1a9876bf4"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var c=new URL(e);return"/"===c.pathname.slice(-1)&&(c.pathname+=a),c.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,a,c,n){var t=new URL(e);return n&&t.pathname.match(n)||(t.search+=(t.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(c)),t.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var c=new URL(a).pathname;return e.some(function(e){return c.match(e)})},stripIgnoredUrlParameters=function(e,a){var c=new URL(e);return c.hash="",c.search=c.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),c.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],c=e[1],n=new URL(a,self.location),t=createCacheKey(n,hashParamName,c,/\.\w{8}\./);return[n.toString(),t]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(c){if(!a.has(c)){var n=new Request(c,{credentials:"same-origin"});return fetch(n).then(function(a){if(!a.ok)throw new Error("Request for "+c+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(c,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(c){return Promise.all(c.map(function(c){if(!a.has(c.url))return e.delete(c)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,c=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(a=urlsToCacheKeys.has(c))||(c=addDirectoryIndex(c,"index.html"),a=urlsToCacheKeys.has(c));var n="/account/index.html";!a&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(c=new URL(n,self.location).toString(),a=urlsToCacheKeys.has(c)),a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(c)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});