/// <reference path="reference/jquery.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base', 'core/factory', 'game'], function(require, exports, Base, reqFactory, Game) {
    /**
    * Main class (entry point for application).
    * Pretty much just creates and inits a new Main class.
    * @class Main
    */
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.call(this, $(document.body));
            this.hasLoaded = false;
            this.log('Main : Constructor');

            this.init();
        }
        /**
        * Main initialization.
        * Inits Analytics, Factory, WindowController.
        * Removes .loading from body on dom.ready
        * @access public
        */
        Main.prototype.init = function () {
            var _this = this;
            var self = this;
            self.log('Main : init');

            // Add ie, iemobile to html if needed
            self.checkUserAgent();

            // Start up GA
            self.Analytics.init();

            // widget factory
            self.Factory = reqFactory.Factory;
            self.Factory.init();

            // window init
            self.WindowController.init();

            $(window).on('load', (function () {
                return _this.onLoadEvent();
            }));

            //fallback for load event
            //(works if window is blurred when loaded)
            self.loadTimer = setInterval(function () {
                if (document.readyState === 'complete' && !self.hasLoaded) {
                    self.onLoadEvent();
                    clearInterval(self.loadTimer);
                }
            }, 50);
        };

        Main.prototype.onLoadEvent = function () {
            var self = this;
            self.hasLoaded = true;
            self.Game = new Game(self.hasTouch);
            self.Game.init();
        };

        /**
        * Determines if User Agent is IE/IE Mobile and Mainends class to html element as necessary.
        * Also detects touch-based devices (html.is-touch) and modifies console.time/End if not in debug mode.
        * @access private
        */
        Main.prototype.checkUserAgent = function () {
            var $html = this.$html, $body = this.$body, UA = $html.attr('data-ua') || '';

            // windows or mac?
            if (navigator && navigator.platform) {
                if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
                    $html.addClass('mac');
                } else if (navigator.platform.match(/Win/i)) {
                    $html.addClass('windows');
                }
            }

            // Various ways to determine if it's IE (since IE10 or 11 is a jerk about its UA)
            if ((/MSIE/i).test(UA) || (/Trident\/[0-9\.]+/i).test(UA) || window.hasOwnProperty('MSStream')) {
                $html.addClass('ie');
                if ((/IEMobile/i).test(UA)) {
                    $html.addClass('ie-mobile');
                }
            }
            var isDebug = ($body.attr('data-debug') && $body.attr('data-debug') === 'true' ? true : false);
            if (!isDebug) {
                console.time = console.timeEnd = function () {
                    return;
                };
            }

            if ('ontouchstart' in window) {
                $html.addClass('is-touch');
            }
        };
        return Main;
    })(Base.SiteObject);

    new Main();
});
