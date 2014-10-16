var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/logger', 'core/windowController', 'core/walt'], function(require, exports, Logger, WindowController, reqWalt) {
    /**
    * Enables this.log and this.Analytics
    * @class Loggable
    */
    var Loggable = (function () {
        function Loggable() {
            this.log = Logger.log;
            this.warn = Logger.warn;
            this.Analytics = Logger.Analytics;
        }
        return Loggable;
    })();
    exports.Loggable = Loggable;

    /**
    * Generic object used throughout project.
    * Establishes vars like $root, $html, etc and exposes global modules (such as Walt, Kiu, PushState, etc)
    * @class SiteObject
    * @extends Base.Loggable
    */
    var SiteObject = (function (_super) {
        __extends(SiteObject, _super);
        function SiteObject(_el) {
            _super.call(this);
            this.$html = $('html');
            this.$window = $(window);
            this.$body = $(document.body);
            this.$htmlBody = $('html, body');
            this.hasTouch = window.hasOwnProperty('ontouchstart');
            this.WindowController = WindowController;
            this.WINDOW_BINDINGS = [];
            this.Walt = reqWalt.Walt;
            if (!_el || !_el.length) {
                this.warn('SiteObject init without an el', this);
                return;
            }
            this.$root = _el;

            this.initDimOverlay();
        }
        /**
        * Removes all window bindings that were made through this object's .bindWindowEvent
        */
        SiteObject.prototype.unbindWindow = function () {
            for (var i = this.WINDOW_BINDINGS.length; i > 0; --i) {
                this.WindowController.unbind(this.WINDOW_BINDINGS.pop());
            }
        };

        /**
        * Binds window event to WindowController,
        * and adds it to the list of existing bindings.
        * @param {string} evt Window event ('scroll', 'resize', etc)
        * @param {any}    cb  Event handler function
        */
        SiteObject.prototype.bindWindowEvent = function (evt, cb) {
            this.WINDOW_BINDINGS.push(this.WindowController.on(evt, cb, this));
        };

        /**
        * Utility function to animate the window's scrollTop
        * @param {number}    targetOffset Offset to animate scrollTop to
        * @param {number}    speed Animation speed in ms (default 500)
        */
        SiteObject.prototype.scrollWindow = function (targetOffset, speed, callback) {
            if (typeof speed === "undefined") { speed = 500; }
            if (speed === 0) {
                this.$htmlBody.scrollTop(targetOffset);
            } else {
                this.$htmlBody.animate({
                    'scrollTop': targetOffset
                }, speed, function () {
                    callback && callback();
                });
            }
        };

        /**
        * Create DimOverlay object
        * @return {DimOverlay}
        */
        SiteObject.prototype.initDimOverlay = function () {
            this.dim = new DimOverlay();
            return this.dim;
        };

        /**
        * Removes any bound window events to prevent the
        * WindowController from looking for handlers that don't exist anymore
        */
        SiteObject.prototype.dispose = function () {
            this.unbindWindow();
        };
        return SiteObject;
    })(Loggable);
    exports.SiteObject = SiteObject;

    /**
    * Default Widget class.
    * Exposes custom event bindings, inherits log/Analytics/global modules/etc.
    * @extends Base.SiteObject
    * @class Widget
    */
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(_el) {
            _super.call(this, _el);

            this.EVENT_BINDINGS = {};

            if (!this.$root.data('app-widget')) {
                this.$root.data('app-widget', this);
            }
        }
        /**
        * Bind custom events
        * This is useful for custom UI widgets that need to emit custom events
        * such as 'changed' or 'whatever-you-want'
        * @param {string} evt Custom event name (e.g. 'my-event')
        * @param {any}    fnc Event handler
        */
        Widget.prototype.bind = function (evt, fnc) {
            if (this.EVENT_BINDINGS.hasOwnProperty(evt)) {
                this.EVENT_BINDINGS[evt].push(fnc);
            } else {
                this.EVENT_BINDINGS[evt] = [fnc];
            }
        };

        /**
        * Alias for Widget.bind
        * @param {string} evt Custom event name (e.g. 'my-event')
        * @param {any}    fnc Event handler
        */
        Widget.prototype.on = function (evt, fnc) {
            return this.bind(evt, fnc);
        };

        /**
        * Trigger for custom events.
        * Given a custom event string, checks if object has made that binding, and executes if so
        * @param {string} type Custom event name (e.g. 'my-event')
        * @param {Object} data Object of any relevant data
        */
        Widget.prototype.onEvents = function (type, data) {
            if (this.EVENT_BINDINGS.hasOwnProperty(type)) {
                for (var i = 0; i < this.EVENT_BINDINGS[type].length; i++) {
                    (this.EVENT_BINDINGS[type][i])(data);
                }
            }
        };

        /**
        * Alias for Widget.onEvents
        * @param {string} type Custom event name (e.g. 'my-event')
        * @param {Object} data Object of any relevant data
        */
        Widget.prototype.emit = function (type, data) {
            return this.onEvents(type, data);
        };

        /**
        * Removes any bindings made to $root and children,
        * also calls SiteObject.dispose (removes window events)
        */
        Widget.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this && this.$root) {
                this.$root.find('*').unbind();
                this.$root.unbind();
            }
        };
        return Widget;
    })(SiteObject);
    exports.Widget = Widget;

    /**
    * DimOverlay class to handle the overlay fade and custom events (onclick etc)
    * Established in Base.SiteObject
    */
    var DimOverlay = (function (_super) {
        __extends(DimOverlay, _super);
        function DimOverlay() {
            _super.call(this);
            this.$body = $(document.body);
            this.$root = this.$el = this.buildDim();
        }
        DimOverlay.prototype.buildDim = function () {
            var $dim = $('#dim');
            if (!$dim || !$dim.length) {
                $dim = $('<div id="dim"></div>').prependTo(document.body);
            }
            return $dim;
        };

        DimOverlay.prototype.show = function (keepDim) {
            if (typeof keepDim === "undefined") { keepDim = false; }
            if (keepDim && this.$body.hasClass('has-dim')) {
                this.$body.addClass('keep-dim');
            }
            this.$root.addClass('show');
            this.$body.addClass('has-dim');
        };

        DimOverlay.prototype.hide = function () {
            if (this.$body.hasClass('keep-dim')) {
                this.$body.removeClass('keep-dim');
                return;
            }
            this.$root.removeClass('show');
            this.$body.removeClass('has-dim');
        };
        return DimOverlay;
    })(Loggable);
    exports.DimOverlay = DimOverlay;
});
