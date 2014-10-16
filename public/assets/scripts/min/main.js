/**
        * requestAnimationFrame shim
        * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
        * MIT license
        */

var __extends;define("core/logger",["require","exports"],function(){var t;return function(t){function e(){var t,e=[];for(t=0;t<arguments.length-0;t++)e[t]=arguments[t+0];s.push(e),window.console&&window.console.log&&d&&window.console.log(Array.prototype.slice.call(e))}function n(){var t,e=[];for(t=0;t<arguments.length-0;t++)e[t]=arguments[t+0];window.console&&window.console.warn&&d&&window.console.warn(Array.prototype.slice.call(e)),e.unshift("WARNING"),s.push(e)}function o(){return s}function i(){for(var t in s)s.hasOwnProperty(t)&&window.console.log(s[t])}function r(t){if(t===!0){if(window&&window.console){window.debug_log.hasOwnProperty("ogLog")||(window.debug_log.ogLog=window.console.log);var e=window.console.log;window.console.log=function(){var t,n=new Error;return n&&n.stack?(t=[].slice.apply(arguments).concat(["\n	"+n.stack.split(/\n/)[3].trim()]),e.apply(this,t)):e(arguments)}}}else window.debug_log.hasOwnProperty("ogLog")&&(window.console.log=window.debug_log.ogLog)}var a,s=[],u=$(document.body),d=u.attr("data-debug")&&"true"===u.attr("data-debug")?!0:!1,c=u.attr("data-debug-lines")&&"true"===u.attr("data-debug-lines")?!0:!1,l=0;t.log=e,t.warn=n,t.getHistory=o,t.printHistory=i,function(t){function n(){return c?(window.hasOwnProperty("ga")?(e("Analytics : init : UA-16821714-5"),ga("create","UA-16821714-5","auto"),ga("send","pageview"),a()):e("Analytics : init - no ga!"),void(p=!0)):void e("Analytics : IS_ENABLED is false, not init'ing")}function o(t,o,i,r){if(c){if(p||n(),e("Analytics : track",t,o,i,r),"boolean"==typeof r&&r===!0&&i){var a=encodeURIComponent(t+o+i),s=d[a];d.hasOwnProperty(a)?(s=parseInt(s,10)+1,r=s):(d[a]=1,r=1)}window.hasOwnProperty("ga")&&t&&o&&(i&&r?ga("send","event",t,o,i,r):i&&!r?ga("send","event",t,o,i):ga("send","event",t,o))}}function i(){c&&(p||n(),window.hasOwnProperty("ga")&&(e("Analytics : pageview",window.location),ga("send","pageview")))}function r(){return a()}function a(){return c?void $("[data-analytics]").not("[data-analytics-count]").on("click",s).attr("data-analytics-count",0):void e("Analytics !IS_ENABLED")}function s(t){var n=$(t.currentTarget),i=parseInt(n.attr("data-analytics-count"),10),r=(n.attr("data-analytics")||"").replace(/\n/g," ").split("|"),a=!1;switch(i+=1,r.length){default:e("Analytics : Fragment click has less than two or more than four tracking parameters",t.currentTarget,r),a=!0;break;case 2:o(r[0],r[1]);break;case 3:o(r[0],r[1],r[2]);break;case 4:o(r[0],r[1],r[2],i)}a||n.attr("data-analytics-count",i)}function u(t,e,n,i){return l+=1,o("dev","error",e+n+(n?" - "+n+(i?" - "+i:""):""),l),!1}var d={},c=("1"===$(document.body).attr("data-prod")?!0:!1)||!1,p=!1;t.init=n,t.track=o,t.pageview=i,t.refresh=r,t.bindClickFragments=a,t.onFragmentClick=s,t.logError=u}(t.Analytics||(t.Analytics={})),a=t.Analytics,window.debug_log=window.debug_log||{printHistory:i,historyLog:s,force:function(t,e){"undefined"==typeof e&&(e=!1),d=t,e===!0&&t===!0?r(e):(t===!1||e===!1)&&r(!1)}},window.onerror=function(t,e,n,o,i){return a.logError(t,e,n,o,i)},r(c),e("Logger : Constructor")}(t||(t={})),t}),define("core/windowController",["require","exports","core/logger"],function(t,e,n){var o;return function(t){function e(){h("WindowController : init"),o(),i(),E=b=!0,r()}function o(){f.on("scroll",function(){E=!0}),f[0].onorientationchange=function(){b=!0,E=!0},f[0].orientationchange=function(){b=!0,E=!0},f.on("resize",function(){E&&"ontouchstart"in window?(E=!0,b=!0):(b=!0,E=!0)})}function i(){var t,e=0,n=["ms","moz","webkit","o"];for(t=0;t<n.length&&!window.requestAnimationFrame;++t)window.requestAnimationFrame=window[n[t]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[n[t]+"CancelAnimationFrame"]||window[n[t]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var n=+new Date,o=Math.max(0,16-(n-e)),i=window.setTimeout(function(){t(n+o)},o);return e=n+o,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}function r(){window.requestAnimationFrame(r),a()}function a(t){if(t||b||E){if(v=null,_=null,S=f.scrollTop(),T=f.width(),C=f.height(),M=T*C,!t&&w===S&&g===M)return void(E=b=!1);for(var e=m.length;e>0;--e)v=m[e-1],_=v.type,("scroll"===_&&(t||E&&S!==w)||"resize"===_&&(t||b&&M!==g))&&v.fn.apply(v.context,[{winWidth:T,winHeight:C,scrollTop:S,scrollBottom:S+C}]);(t||w!==S)&&(w=S),(t||g!==M)&&(g=M),E=b=!1}}function s(t,e,n){var o=(+new Date+99999*Math.random()).toFixed(0);return h("WindowController : bind",t,n,o),m.push({type:t,fn:e,context:n,id:o}),p&&clearTimeout(p),p=setTimeout(function(){a(!0)},y),o}function u(t,e,n){return s(t,e,n)}function d(t){var e,n;if("undefined"!=typeof t){for(n=m.length;n>0;--n)if(e=m[n-1],e.id===t)return m.splice(n-1,1),h("WindowController : unbind",!0),!0;return h("WindowController : unbind",!1,t,m),!1}}function c(t){return d(t)}function l(t){switch(h("WindowController : trigger",t),t){case"resize":b=!0;break;case"scroll":E=!0}a(!0)}var p,h=n.log,f=$(window),m=[],y=100,w=-1,g=-1,E=!1,b=!1,v=null,S=null,T=null,C=null,_=null,M=null;t.init=e,t.bind=s,t.on=u,t.unbind=d,t.off=c,t.trigger=l,h("WindowController : Constructor")}(o||(o={})),o}),define("core/walt",["require","exports","core/logger"],function(t,e,n){var o,i;!function(t){var e,n;!function(t){function e(t,e,n){var o,i,r=parseFloat(n);return 1/0===r||-1>=r||isNaN(r)?-1:(o=parseFloat(t),t.indexOf("ms")>0||t.indexOf("ms")<0&&t.indexOf("s")<0||t.indexOf("s")>0&&(o*=1e3),i=parseFloat(e),e.indexOf("ms")>0||e.indexOf("ms")<0&&e.indexOf("s")<0||e.indexOf("s")>0&&(i*=1e3),parseInt(o,10)+parseInt(i,10))}t.realAnimTime=e}(t.Math||(t.Math={})),e=t.Math,function(t){function e(){var t,e,n=document.body||document.documentElement,o=n.style,i="animation";if("string"==typeof o[i])return!0;for(t=["moz","Moz","webkit","Webkit","ms","Ms"],i=i.charAt(0).toUpperCase()+i.substr(1),e=0;e<t.length;e++)if("string"==typeof o[t[e]+i])return!0;return!1}function n(t,e){var n=o("delay",t.delay?t.delay:e.delay),r=o("duration",t.duration?t.duration:e.duration),a=o("direction",t.direction?t.direction:e.direction),s=o("iteration-count",t.count?t.count:e.count),u=o("fill-mode",t.fill?t.fill:e.fill),d=o("timing-function",t.timing?t.timing:e.timing);return i(n,r,a,s,u,d)}function o(t,e){var n,o,i;for("fill-mode"!==t&&"direction"!==t&&"timing-function"!==t&&e.indexOf&&e.indexOf("s")<0&&e.indexOf("ms")<0&&(e+="ms"),n={},o=["moz","webkit","ms"],n["animation-"+t]=e,i=0;i<o.length;i++)n["-"+o[i]+"-animation-"+t]=e;return n}function i(){var t,e,n,o,i,r=[];for(t=0;t<arguments.length-0;t++)r[t]=arguments[t+0];for(e={},o=0;o<r.length;o++){n=r[o];for(i in n)n.hasOwnProperty(i)&&!e.hasOwnProperty(i)&&(e[i]=n[i])}return e}t.supportsAnimations=e,t.createCSS=n}(t.CSS||(t.CSS={})),n=t.CSS}(o||(o={})),function(t){function e(){return d}function i(e){var n,o,i,a;e.hasOwnProperty("el")&&(n=e.el instanceof $?e.el:$(e.el),e.hasOwnProperty("animation")&&""!==e.animation&&(o=u.CSS.createCSS(e,t.DEFAULTS),e.hasOwnProperty("onBefore")&&e.onBefore(n),i=c.hasClass("no-focus"),navigator.userAgent.indexOf("Safari")>-1&&navigator.userAgent.indexOf("Chrome")<=-1&&(i=!1),!d||i?e.hasOwnProperty("fallback")?e.fallback(n,function(){return r(n,e)}):(n.addClass(i?"walt-animate "+e.animation:"walt-animate"),r(n,e)):n&&n.length?n.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){return r(n,e)}).css(o).addClass("walt-animate "+e.animation):r(n,e),e.hasOwnProperty("useTimeout")&&e.useTimeout===!0&&(a=u.Math.realAnimTime(e.duration||t.DEFAULTS.duration,e.delay||t.DEFAULTS.delay,e.count||t.DEFAULTS.count),a>=0&&window.setTimeout(function(){return r(n,e)},1.15*a))))}function r(t,e){t.off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd"),t.hasClass("walt-animate")&&(t.removeClass("walt-animate").removeClass(e.animation),t.attr("style",(t.attr("style")||"").replace(/animation:.*?;|-webkit-animation:.*?;|-moz-animation:.*?;/g,"")),e.hasOwnProperty("onComplete")&&e.onComplete(t))}function a(){function t(t){var o="no-focus",i="in-focus",r={focus:o,focusin:o,pageshow:o,blur:i,focusout:i,pagehide:i};t=t||window.event,t.type in r?(e.removeClass(o+" "+i),e.addClass(r[t.type])):(e.removeClass(o+" "+i),e.addClass(this[n]?o:i))}var e,n;"ontouchstart"in window||(e=$(document.body),n="hidden",n in document?document.addEventListener("visibilitychange",t):(n="mozHidden")in document?document.addEventListener("mozvisibilitychange",t):(n="webkitHidden")in document?document.addEventListener("webkitvisibilitychange",t):(n="msHidden")in document?document.addEventListener("msvisibilitychange",t):"onfocusin"in document?document.onfocusin=document.onfocusout=t:window.onpageshow=window.onpagehide=window.onfocus=window.onblur=t)}var s=n.log,u=o,d=u.CSS.supportsAnimations(),c=$(document.body);t.DEFAULTS={el:$(document.body||document.documentElement),animation:"",delay:"0s",duration:"1s",count:"0",fill:"both",direction:"normal",timing:"ease",useTimeout:!1},t.supportsAnimations=e,t.animate=i,a(),s("Walt : Constructor")}(e.Walt||(e.Walt={})),i=e.Walt}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("core/base",["require","exports","core/logger","core/windowController","core/walt"],function(t,e,n,o,i){var r,a,s,u=function(){function t(){this.log=n.log,this.warn=n.warn,this.Analytics=n.Analytics}return t}();e.Loggable=u,r=function(t){function e(e){return t.call(this),this.$html=$("html"),this.$window=$(window),this.$body=$(document.body),this.$htmlBody=$("html, body"),this.hasTouch=window.hasOwnProperty("ontouchstart"),this.WindowController=o,this.WINDOW_BINDINGS=[],this.Walt=i.Walt,e&&e.length?(this.$root=e,void this.initDimOverlay()):void this.warn("SiteObject init without an el",this)}return __extends(e,t),e.prototype.unbindWindow=function(){for(var t=this.WINDOW_BINDINGS.length;t>0;--t)this.WindowController.unbind(this.WINDOW_BINDINGS.pop())},e.prototype.bindWindowEvent=function(t,e){this.WINDOW_BINDINGS.push(this.WindowController.on(t,e,this))},e.prototype.scrollWindow=function(t,e,n){"undefined"==typeof e&&(e=500),0===e?this.$htmlBody.scrollTop(t):this.$htmlBody.animate({scrollTop:t},e,function(){n&&n()})},e.prototype.initDimOverlay=function(){return this.dim=new s,this.dim},e.prototype.dispose=function(){this.unbindWindow()},e}(u),e.SiteObject=r,a=function(t){function e(e){t.call(this,e),this.EVENT_BINDINGS={},this.$root.data("app-widget")||this.$root.data("app-widget",this)}return __extends(e,t),e.prototype.bind=function(t,e){this.EVENT_BINDINGS.hasOwnProperty(t)?this.EVENT_BINDINGS[t].push(e):this.EVENT_BINDINGS[t]=[e]},e.prototype.on=function(t,e){return this.bind(t,e)},e.prototype.onEvents=function(t,e){if(this.EVENT_BINDINGS.hasOwnProperty(t))for(var n=0;n<this.EVENT_BINDINGS[t].length;n++)this.EVENT_BINDINGS[t][n](e)},e.prototype.emit=function(t,e){return this.onEvents(t,e)},e.prototype.dispose=function(){t.prototype.dispose.call(this),this&&this.$root&&(this.$root.find("*").unbind(),this.$root.unbind())},e}(r),e.Widget=a,s=function(t){function e(){t.call(this),this.$body=$(document.body),this.$root=this.$el=this.buildDim()}return __extends(e,t),e.prototype.buildDim=function(){var t=$("#dim");return t&&t.length||(t=$('<div id="dim"></div>').prependTo(document.body)),t},e.prototype.show=function(t){"undefined"==typeof t&&(t=!1),t&&this.$body.hasClass("has-dim")&&this.$body.addClass("keep-dim"),this.$root.addClass("show"),this.$body.addClass("has-dim")},e.prototype.hide=function(){return this.$body.hasClass("keep-dim")?void this.$body.removeClass("keep-dim"):(this.$root.removeClass("show"),void this.$body.removeClass("has-dim"))},e}(u),e.DimOverlay=s}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("ui/MoreInfo",["require","exports","core/base"],function(t,e,n){var o=function(t){function e(e){t.call(this,e),this.log("MoreInfo : Constructor")}return __extends(e,t),e}(n.Widget);return o}),define("core/factory",["require","exports","core/logger","ui/MoreInfo"],function(t,e,n,o){!function(t){function e(t){c("Factory : init"),d=t||document.body,a()}function i(t,e){$(d).find('[widget="'+e+'"]').each(function(e,n){var o=$(n);o.length&&!o.data("app-widget")?o.data("app-widget",new t(o)):o.length&&o.data("app-widget")&&o.data("app-widget")&&o.data("app-widget").refresh&&o.data("app-widget").refresh()})}function r(t){t&&"object"!=typeof t?p[t]&&i(p[t],t):t&&"object"!=typeof t||a()}function a(){c("Factory : initWidgets");for(var t in p)p.hasOwnProperty(t)&&r(t);s()}function s(){var t,e=[];$("[widget]").each(function(n,o){t=$(o),!t.data("app-widget")&&e.indexOf(t.attr("widget"))<0&&e.push(t.attr("widget"))}),e.length&&l("Factory : Found widget declaration"+(e.length>1?"s":"")+" without defined widget"+(e.length>1?"s":"")+" to apply",e.join(", "))}function u(t){c("Factory : removeWidgets");$(t||d).find("[widget]").each(function(t,e){var n=$(e),o=n.data("app-widget");o&&o.dispose&&o.dispose()})}var d,c=n.log,l=n.warn,p={moreInfo:o};c("Factory : Constructor"),t.init=e,t.refresh=r,t.removeWidgets=u}(e.Factory||(e.Factory={}));e.Factory}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/util/Audio",["require","exports","core/base","core/logger"],function(t,e,n,o){var i;return function(t){function e(){return t.IS_MUTED}function i(){o.log("Audio : Mute (global)"),t.IS_MUTED=!0,$("audio").each(function(t,e){$(e).attr("muted","true"),e.volume=0})}function r(){o.log("Audio : Unmute (global)"),t.IS_MUTED=!1,$("audio").each(function(t,e){$(e).attr("muted",null),e.volume=1})}var a,s;t.IS_MUTED=!1,t.isMuted=e,t.mute=i,t.unmute=r,a=function(e){function n(t,n,o){"undefined"==typeof n&&(n=!1),"undefined"==typeof o&&(o=!1),e.call(this),this.url=t,this.loop=n,this.autoplay=o,this.$body=$(document.body),this.IS_LOADED=!1,this.LOAD_EVENTS=[],this.log("Sound : Constructor"),this.init()}return __extends(n,e),n.prototype.init=function(){this.log("Sound : Init"),this.buildElement()},n.prototype.buildElement=function(){var e=this;e.$root=$('<audio src="'+e.url+'" preload="auto" controls'+(this.loop?" loop":"")+(t.IS_MUTED?" muted":"")+"></audio>"),e.root=e.$root[0],e.autoplay&&e.play(),e.$root.on("loadeddata",function(t){return e.onLoadEvent(t)}),e.$body.append(e.$root)},n.prototype.onLoadEvent=function(){var t,e,n=this;for(n.IS_LOADED=!0,e=0;e<n.LOAD_EVENTS.length;e++)t=n.LOAD_EVENTS[e],t instanceof Array?t[0].apply(t[1]):t()},n.prototype.onLoad=function(t,e){var n=this;n.IS_LOADED===!0?e?t.apply(e):t():n.LOAD_EVENTS.push(e?[t,e]:t)},n.prototype.play=function(){var t=this;t.log("Audio.Music : play"),t.onLoad(function(){})},n.prototype.pause=function(){var t=this;t.log("Audio.Music : pause"),t.root.pause&&t.root.pause()},n.prototype.stop=function(){var t=this;t.log("Audio.Music : stop"),t.root.stop&&t.root.stop()},n}(n.Loggable),t.Sound=a,s=function(t){function e(e,n){"undefined"==typeof n&&(n=!1),t.call(this,e,!0,n),this.log("Music : Constructor")}return __extends(e,t),e}(t.Sound),t.Music=s}(i||(i={})),i}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/util/Grid",["require","exports","core/base"],function(t,e,n){var o=function(t){function e(e,n,o){t.call(this),this.Game=e,this.size=n,this.step=o,this.$body=$(document.body),this.log("Grid : Constructor"),this.init()}return __extends(e,t),e.prototype.init=function(){var t,e,n,o,i=this;for(i.geometry=new THREE.Geometry,i.material=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,fog:!0,opacity:.8,transparent:!0}),i.color1=new THREE.Color(4473924),i.color2=new THREE.Color(8947848),i.mesh=new THREE.Object3D,t=-i.size;t<=i.size;t+=i.step)e=0===t?i.color1:i.color2,n=new THREE.Geometry,n.vertices.push(new THREE.Vector3(-i.size,0,t),new THREE.Vector3(i.size,0,t)),n.colors.push(e,e),o=new THREE.Geometry,o.vertices.push(new THREE.Vector3(t,0,-i.size),new THREE.Vector3(t,0,i.size)),o.colors.push(e,e),i.mesh.add(new THREE.Line(n,i.material),new THREE.Line(o,i.material));i.Game.addToScene(i.mesh)},e}(n.Loggable);return o}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/global/BGController",["require","exports","core/base","game/util/Audio","game/util/Grid"],function(t,e,n,o,i){var r=function(t){function e(e){t.call(this),this.Game=e,this.log("BGController : Constructor"),this.init()}return __extends(e,t),e.prototype.init=function(){this.log("BGController : Init"),this.drawStars(),this.createLight(),this.createGameGrid(),this.makeSweetBeautifulMusic()},e.prototype.makeSweetBeautifulMusic=function(){this.bgMusic=new o.Music("assets/sounds/lose.ogg",!0)},e.prototype.drawStars=function(){this.log("BGController : drawStars"),this.starMesh=this.createStars(),this.Game.addToScene(this.starMesh),this.Game.addUpdate(this.updateStars,this)},e.prototype.updateStars=function(t){this.starMesh.rotation.x+=t/200},e.prototype.createLight=function(){this.log("BGController : createLight"),this.Game.addToScene(new THREE.AmbientLight(16711422))},e.prototype.createStars=function(){var t,e,n,o;return this.log("BGController : createStars"),t=new THREE.SphereGeometry(1e4,60,40),e={texture:{type:"t",value:THREE.ImageUtils.loadTexture("assets/images/galaxy_starfield.png")}},n=new THREE.ShaderMaterial({uniforms:e,vertexShader:document.getElementById("sky-vertex").textContent,fragmentShader:document.getElementById("sky-fragment").textContent}),o=new THREE.Mesh(t,n),o.scale.set(-1,1,1),o.rotation.order="XZY",o.renderDepth=1e3,o.rotation.x+=90,o},e.prototype.createGameGrid=function(){var t,e,n,o;this.log("BGController : createGameGrid"),t=1e3,e=50,n=new i(this.Game,t,e),o=new THREE.Object3D,o.add(n.mesh),this.Game.addToScene(o)},e}(n.Loggable);return r}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/util/Menu",["require","exports","core/base","game/util/Audio"],function(t,e,n,o){var i=function(t){function e(e,n,o){"undefined"==typeof n&&(n="assets/sounds/menu.ogg"),"undefined"==typeof o&&(o="Menu"),t.call(this),this.Game=e,this.musicURL=n,this.TEMPLATE=o,this.$body=$(document.body),this.IS_SHOWING=!1,this.ENABLED=!1,this.log("Menu : Constructor"),this.init()}return __extends(e,t),e.prototype.init=function(){this.log("Menu : Init"),this.buildElement(),this.loadMusic(),this.bindKeys()},e.prototype.buildElement=function(){var t=this;t.$root=$(t.$body.find('[data-template="'+t.TEMPLATE+'"]').html()),t.Game.$ui.prepend(t.$root)},e.prototype.loadMusic=function(){var t=this;t.bgMusic=new o.Music(t.musicURL)},e.prototype.bindKeys=function(){var t=this;this.$body.on("keyup",function(e){e.which;switch(e.which){case 27:t.ENABLED&&t.toggleVisibility()}})},e.prototype.enable=function(){return this.ENABLED=!0,this},e.prototype.disable=function(){return this.ENABLED=!1,this},e.prototype.toggleVisibility=function(){return this.IS_SHOWING?this.hide():this.show()},e.prototype.show=function(){var t=this;return t.IS_SHOWING=!0,t.$root.addClass("is-visible"),t.$body.addClass("has-menu has-ui"),t.bgMusic.play(),t},e.prototype.hide=function(){var t=this;return t.IS_SHOWING=!1,t.$root.removeClass("is-visible"),t.$body.removeClass("has-menu has-ui"),t.bgMusic.pause(),t},e}(n.Loggable);return i}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/global/MainMenu",["require","exports","game/util/Menu"],function(t,e,n){var o=function(t){function e(e){t.call(this,e,"assets/sounds/menu.ogg","MainMenu"),this.log("MainMenu : Constructor"),this.createItems(),this.updateList()}return __extends(e,t),e.prototype.createItems=function(){var t=this;this.menuItems={"New Game":function(){return t.newGame()}}},e.prototype.newGame=function(){this.hide(),this.Game.startGame.call(this.Game)},e.prototype.updateList=function(){var t,e,n=this.$root.find(".menu-list");for(t in this.menuItems)this.menuItems.hasOwnProperty(t)&&(e=$("<li>"+t+"</li>"),e.on("click",this.menuItems[t]),n.append(e))},e}(n);return o}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game/global/Ship",["require","exports","core/base"],function(t,e,n){var o=function(t){function e(e){t.call(this),this.Game=e,this.$body=$(document.body),this.log("Ship : Constructor"),this.init()}return __extends(e,t),e.prototype.init=function(){var t=this;t.createShip(),t.bindKeys()},e.prototype.createShip=function(){var t,e=this,n=500;e.mesh=new Physijs.BoxMesh(new THREE.BoxGeometry(n,n,n),Physijs.createMaterial(new THREE.MeshLambertMaterial({color:16777215,fog:!1}),1,1),10),t=new THREE.PointLight(16711680),e.mesh.add(t),t.intensity=1,t.position.set(0,0,0),e.mesh.position.set(-500,0,0),e.mesh.__dirtyPosition=!0,e.mesh.castShadow=e.mesh.receiveShadow=!1},e.prototype.bindKeys=function(){var t=this;this.$body.on("keydown",function(e){switch(e.which){case 87:t.push("up");break;case 83:t.push("down");break;case 65:t.push("left");break;case 68:t.push("right")}})},e.prototype.getMesh=function(){return this.mesh},e.prototype.push=function(t){var e=this,n=1e4;switch(t){case"up":e.mesh.applyImpulse(new THREE.Vector3(-n,0,0),new THREE.Vector3(0,0,0));break;case"down":e.mesh.applyImpulse(new THREE.Vector3(n,0,0),new THREE.Vector3(0,0,0));break;case"right":e.mesh.applyImpulse(new THREE.Vector3(0,0,-n),new THREE.Vector3(0,0,0));break;case"left":e.mesh.applyImpulse(new THREE.Vector3(0,0,n),new THREE.Vector3(0,0,0))}},e}(n.Loggable);return o}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("game",["require","exports","core/base","game/global/BGController","game/global/MainMenu","game/global/Ship","game/util/Audio"],function(t,e,n,o,i,r,a){var s=function(t){function e(e){"undefined"==typeof e&&(e=!1),t.call(this,$(document.body)),this.isMobile=e,this.shouldLog=!1,this.MOUSE={x:-1,y:-1},this.updateQueue=[],this.updateKeys={},this.renderQueue=[],this.renderKeys={},this.log("Game : Constructor"+(this.isMobile?" : Mobile":" : Desktop"))}return __extends(e,t),e.prototype.init=function(){var t=this;t.log("Game : Init"),t.createGameElements(),t.bindGlobalKeyboardEvents(),t.makeMainMenu()},e.prototype.bindMouseEvents=function(){var t=this;t.$gameDisplay.on("mousemove",function(e){t.MOUSE.x=e.clientX/window.innerWidth*2-1,t.MOUSE.y=2*-(e.clientY/window.innerHeight)+1})},e.prototype.cameraFollow=function(){var t=this,e=new THREE.Vector3(0,1e3,0),n=e.applyMatrix4(t.FOLLOWING.matrixWorld),o=t.Camera;o.position.x=n.x,o.position.y=n.y,o.position.z=n.z},e.prototype.animate=function(){var t,e,n=this;window.requestAnimationFrame(function(){return n.animate()}),t=this.Clock.getDelta(),e=this.Clock.getElapsedTime(),this.update(t,e),this.render(this.Scene,this.Camera)},e.prototype.update=function(t,e){this.updateQueue.forEach(function(n){n&&n(t,e)})},e.prototype.render=function(t,e){this.renderQueue.forEach(function(n){n&&n(t,e)})},e.prototype.createGameElements=function(){var t=this;t.$container=$(t.$body.find('[data-template="Game"]').html()),t.$root.prepend(t.$container),t.$ui=t.$container.find(".game-ui")},e.prototype.makeMainMenu=function(){var t=this;t.MainMenu=new i(this),t.MainMenu.show()},e.prototype.bindGlobalKeyboardEvents=function(){this.$body.on("keyup",function(t){t.which;switch(t.which){case 77:a.isMuted()?a.unmute():a.mute()}})},e.prototype.startGame=function(){var t=this;t.Keyboard=new THREEx.KeyboardState,t.Clock=new THREE.Clock,t.makeScene(),t.makeStats(),t.makeCamera(),t.makeRenderer(),t.bindEvents(),t.bindMouseEvents(),t.BGController=new o(t),t.bindIntersections(),t.makePlanets(),t.makeShip(),t.addRender(t.Renderer.render,t.Renderer),t.animate()},e.prototype.makeShip=function(){var t=this;t.playerShip=new r(t),t.addToScene(t.playerShip.getMesh()),t.FOLLOWING=t.playerShip.getMesh(),t.addUpdate(t.cameraFollow,t,"Camera:Follow")},e.prototype.makePlanets=function(){var t,e=this;for(t=0;20>t;t++)e.addToScene(function(){var e,n,o,i=new Physijs.SphereMesh(new THREE.SphereGeometry(15*Math.random()+10,32,32),Physijs.createMaterial(new THREE.MeshLambertMaterial({color:16777215,fog:!1}),0,0),10);return i.position.set(900*Math.random()*(Math.random()>.5?-1:1),0,100*Math.random()*(Math.random()>.5?-1:1)),i.castShadow=i.receiveShadow=!0,i.fog=!1,e=new THREE.MeshBasicMaterial({color:65280,side:THREE.BackSide,fog:!1,opacity:.4,transparent:!0}),n=new THREE.Mesh(i.geometry,e),i.add(n),n.position.set(0,0,0),n.scale.multiplyScalar(1.3),n.visible=!1,i.outlineEffect=n,t%2===0&&(o=new THREE.PointLight(16777215),i.add(o),o.intensity=Math.random()/3,o.position.set(0,0,0)),i}());e.addToScene(function(){var t,e,n=new Physijs.SphereMesh(new THREE.SphereGeometry(15*Math.random()+10,32,32),new THREE.MeshLambertMaterial({color:16777215,fog:!1}));return n.position.set(0,0,0),n.castShadow=!1,n.fog=!1,t=new THREE.MeshBasicMaterial({color:65280,side:THREE.BackSide,fog:!1,opacity:.4,transparent:!0}),e=new THREE.Mesh(n.geometry,t),n.add(e),e.position.set(0,0,0),e.scale.multiplyScalar(1.3),e.visible=!1,n.outlineEffect=e,n}())},e.prototype.makeScene=function(){var t=this;return t.Scene=new Physijs.Scene,t.Scene.setGravity(new THREE.Vector3(0,0,0)),t.Scene.fog=new THREE.FogExp2(0,.002),t.addRender(function(){t.Scene.simulate()},t),t.Scene},e.prototype.addToScene=function(){var t,e,n,o=[];for(t=0;t<arguments.length-0;t++)o[t]=arguments[t+0];for(e=this,e.log("Game : addToScene",o),n=0;n<o.length;n++)e.Scene.add(o[n]);return!0},e.prototype.makeCamera=function(){var t,e,n,o,i=this;i.SCREEN_WIDTH=window.innerWidth,i.SCREEN_HEIGHT=window.innerHeight,t=45,e=i.SCREEN_WIDTH/i.SCREEN_HEIGHT,n=.1,o=2e4,i.Camera=new THREE.PerspectiveCamera(t,e,n,o),i.addToScene(i.Camera),i.Camera.position.set(0,500,0)},e.prototype.makeRenderer=function(){var t=this;t.Renderer=Detector&&Detector.webgl?new THREE.WebGLRenderer({antialias:!0}):new THREE.CanvasRenderer,t.Renderer.setSize(t.SCREEN_WIDTH,t.SCREEN_HEIGHT),t.Renderer.shadowMapEnabled=!0,t.$gameDisplay=t.$container.find(".game-display"),t.gameDisplay=t.$gameDisplay[0],t.gameDisplay.appendChild(t.Renderer.domElement),THREEx.WindowResize(t.Renderer,t.Camera)},e.prototype.bindEvents=function(){var t,e=this;THREEx.FullScreen.bindKey({charCode:"f".charCodeAt(0)}),e.Controls=new THREE.TrackballControls(e.Camera,e.Renderer.domElement),t=e.Controls,t.minDistance=100,t.maxDistance=2e3,t.zoomSpeed=2.25,t.panSpeed=.6,t.rotateSpeed=.025,t.noRoll=!0,e.enableTrackball()},e.prototype.enableTrackball=function(){return this.disableTrackball()},e.prototype.disableTrackball=function(){var t=this;t.Controls.enabled=!1,t.removeUpdate("Global:Controls")},e.prototype.bindIntersections=function(){this.projector=new THREE.Projector,this.addUpdate(this.findIntersections,this)},e.prototype.findIntersections=function(){var t,e,n=this,o=new THREE.Vector3(n.MOUSE.x,n.MOUSE.y,1);n.projector.unprojectVector(o,n.Camera),t=new THREE.Raycaster(n.Camera.position,o.sub(n.Camera.position).normalize()),e=t.intersectObjects(n.Scene.children),e.length>0?e[0].object!==n.INTERSECTED&&(n.INTERSECTED&&n.INTERSECTED.hasOwnProperty("outlineEffect")&&(n.INTERSECTED.outlineEffect.visible=!1),n.INTERSECTED=e[0].object,n.INTERSECTED&&n.INTERSECTED.hasOwnProperty("outlineEffect")&&(n.INTERSECTED.outlineEffect.visible=!0)):(n.INTERSECTED&&n.INTERSECTED.hasOwnProperty("outlineEffect")&&(n.INTERSECTED.outlineEffect.visible=!1),n.INTERSECTED=null)},e.prototype.makeStats=function(){var t=this;t.StatsDisplay=new Stats,t.StatsDisplay.domElement.style.position="fixed",t.StatsDisplay.domElement.style.bottom="0px",t.StatsDisplay.domElement.style.zIndex=100,t.$ui.append(t.StatsDisplay.domElement),t.addUpdate(t.StatsDisplay.update,t.StatsDisplay)},e.prototype.addUpdate=function(t,e,n){return n&&this.updateKeys.hasOwnProperty(n)?-1:(this.updateQueue.push(function(t,e){return function(n,o){t.call(e,n,o)}}(t,e)),n&&(this.updateKeys[n]=this.updateQueue.length-1),this.updateQueue.length-1)},e.prototype.removeUpdate=function(t){var e;"string"==typeof t?(e=this.updateKeys[t],delete this.updateKeys[t]):e=t,this.updateQueue[e]=null},e.prototype.addRender=function(t,e,n){return n&&this.renderKeys.hasOwnProperty(n)?-1:(this.renderQueue.push(function(t,e){return function(n,o){t.call(e,n,o)}}(t,e)),n&&(this.renderKeys[n]=this.renderQueue.length-1),this.renderQueue.length-1)},e.prototype.removeRender=function(t){var e;"string"==typeof t?(e=this.renderKeys[t],delete this.renderKeys[t]):e=t,this.renderQueue[e]=null},e}(n.SiteObject);return s}),__extends=this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},define("main",["require","exports","core/base","core/factory","game"],function(t,e,n,o,i){var r=function(t){function e(){t.call(this,$(document.body)),this.hasLoaded=!1,this.log("Main : Constructor"),this.init()}return __extends(e,t),e.prototype.init=function(){var t=this,e=this;e.log("Main : init"),e.checkUserAgent(),e.Analytics.init(),e.Factory=o.Factory,e.Factory.init(),e.WindowController.init(),$(window).on("load",function(){return t.onLoadEvent()}),e.loadTimer=setInterval(function(){"complete"!==document.readyState||e.hasLoaded||(e.onLoadEvent(),clearInterval(e.loadTimer))},50)},e.prototype.onLoadEvent=function(){var t=this;t.hasLoaded=!0,t.Game=new i(t.hasTouch),t.Game.init()},e.prototype.checkUserAgent=function(){var t,e=this.$html,n=this.$body,o=e.attr("data-ua")||"";navigator&&navigator.platform&&(navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)?e.addClass("mac"):navigator.platform.match(/Win/i)&&e.addClass("windows")),(/MSIE/i.test(o)||/Trident\/[0-9\.]+/i.test(o)||window.hasOwnProperty("MSStream"))&&(e.addClass("ie"),/IEMobile/i.test(o)&&e.addClass("ie-mobile")),t=n.attr("data-debug")&&"true"===n.attr("data-debug")?!0:!1,t||(console.time=console.timeEnd=function(){}),"ontouchstart"in window&&e.addClass("is-touch")},e}(n.SiteObject);new r});