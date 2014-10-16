import Base = require('core/base');
import Logger = require('core/logger');

/* Widgets */
import MoreInfo = require('ui/MoreInfo');

export module Factory {
    var log:any = Logger.log,
        warn:any = Logger.warn,
        _context:any;

    // TODO: Turn this into an array for faster lookup
    var WIDGET_DEFINITIONS:Object = {
        'moreInfo': MoreInfo
    };

    log('Factory : Constructor');

    // ---

    /**
     * Variable initialization
     * @access public
     * @param {string} context Selector string
     */
    export function init(context:string):void {
        log('Factory : init');
        _context = context || document.body;
        initWidgets();
    };

    /**
     * Looks for a particular widget and inits if element doesn't already have a widget on it
     * @param {Widget}    module Reference to the new widget to init
     * @param {string}    selector widget search string
     * @access private
     */
    function initIfNeeded(module:any, selector:string):void {
        $(_context).find('[widget="' + selector +'"]').each(function (i, v) {
            var target:JQuery = $(v);
            if (target.length && !target.data('app-widget')) {
                target.data('app-widget', new module(target));
            } else if (target.length && target.data('app-widget')) {
                if (target.data('app-widget') && target.data('app-widget').refresh) {
                    target.data('app-widget').refresh();
                }
            }
        });
    }

    /**
     * Finds widgets within a given a container (string selector or jquery object),
     * and inits them if necessary.
     * @param {string|JQuery} selector Selector string or JQuery object of target container
     * @access private
     */
    function refreshSection(selector:any):void {
        var oldContext = _context;
        _context = (selector instanceof $) ? selector : $(selector);

        initWidgets();

        _context = oldContext;
    }

    /**
     * Finds and inits widgets within a certain container
     * (no selector results in Factory.initWidgets())
     * @param {any} selector? Container to search for widgets
     * @access public
     */
    export function refresh(selector?:any):void {
        // log('Factory : refresh', selector);
        if (selector && (typeof selector !== 'object')) {
            if (WIDGET_DEFINITIONS[selector]) {
                initIfNeeded(WIDGET_DEFINITIONS[selector], selector);
            }
        } else if(!selector || (typeof selector === 'object')) {
            initWidgets();
        }
    }


    /**
     * Loops through entire list of Widget definitions
     * and attempts to refresh/init those it finds.
     * @access private
     */
    function initWidgets():void {
        log('Factory : initWidgets');

        for (var widget in WIDGET_DEFINITIONS) {
            if(WIDGET_DEFINITIONS.hasOwnProperty(widget)){
                refresh(widget);
            }
        }

        findMissingWidgets();
    }

    function findMissingWidgets():void {
        var missing:Array<string> = [],
            $v:JQuery;

        $('[widget]').each(function(i:number, v:HTMLElement){
            $v = $(v);
            if(!$v.data('app-widget') && missing.indexOf($v.attr('widget')) < 0){
                missing.push($v.attr('widget'));
            }
        });

        if(missing.length){
            warn('Factory : Found widget declaration' + (missing.length > 1 ? 's' : '') + ' without defined widget'+(missing.length > 1 ? 's' : '') + ' to apply', missing.join(', '));
        }
    }

    /**
     * Finds active widgets within container (if given), and calls dispose
     * @param {string|JQuery} container? Target container to search for active widgets
     * @access public
     */
    export function removeWidgets(container?:any):void {
        log('Factory : removeWidgets');
        var self = this;
        $(container || _context).find('[widget]').each(function(i,v){
            var $v = $(v),
                    widgeData = $v.data('app-widget');
            if(!widgeData){ return; }
            widgeData.dispose&&widgeData.dispose();
        });
    }

}

