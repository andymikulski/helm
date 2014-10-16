declare var $:any;

import Logger = require('core/logger');
import WindowController = require('core/windowController');
import reqWalt = require('core/walt');

/**
 * Enables this.log and this.Analytics
 * @class Loggable
 */
export class Loggable {
    log: any;
	warn: any;
	Analytics: any;
	constructor(){
        this.log = Logger.log;
		this.warn = Logger.warn;
		this.Analytics = Logger.Analytics;
	}
}

/**
 * Generic object used throughout project.
 * Establishes vars like $root, $html, etc and exposes global modules (such as Walt, Kiu, PushState, etc)
 * @class SiteObject
 * @extends Base.Loggable
 */
export class SiteObject extends Loggable {
	$root:JQuery;
	$html:JQuery = $('html');
	$window:JQuery = $(window);
	$body:JQuery = $(document.body);
    $htmlBody:JQuery = $('html, body');
    dim:DimOverlay;
    hasTouch:boolean = window.hasOwnProperty('ontouchstart');

	WindowController:any = WindowController;
	WINDOW_BINDINGS:Array<string> = [];

	Walt:any = reqWalt.Walt;

	constructor(_el?:JQuery){
		super();
		if(!_el || !_el.length){
            this.warn('SiteObject init without an el', this);
			return;
		}
		this.$root = _el;

        this.initDimOverlay();
	}

	/**
	 * Removes all window bindings that were made through this object's .bindWindowEvent
	 */
	unbindWindow():void {
        for(var i = this.WINDOW_BINDINGS.length; i > 0; --i){
            this.WindowController.unbind(this.WINDOW_BINDINGS.pop());
        }
    }

    /**
     * Binds window event to WindowController,
     * and adds it to the list of existing bindings.
     * @param {string} evt Window event ('scroll', 'resize', etc)
     * @param {any}    cb  Event handler function
     */
    bindWindowEvent(evt:string, cb:any):void {
        this.WINDOW_BINDINGS.push(this.WindowController.on(evt, cb, this));
    }

    /**
     * Utility function to animate the window's scrollTop
     * @param {number}    targetOffset Offset to animate scrollTop to
     * @param {number}    speed Animation speed in ms (default 500)
     */
    scrollWindow(targetOffset:number, speed:number = 500, callback?:any):void {
        if(speed === 0){
            this.$htmlBody.scrollTop(targetOffset);
        }else{
            this.$htmlBody.animate({
                'scrollTop': targetOffset
            }, speed, function(){
                callback && callback();
            });
        }
    }

    /**
     * Create DimOverlay object
     * @return {DimOverlay}
     */
    initDimOverlay():DimOverlay {
        this.dim = new DimOverlay();
        return this.dim;
    }

    /**
     * Removes any bound window events to prevent the
     * WindowController from looking for handlers that don't exist anymore
     */
    dispose():void {
    	this.unbindWindow();
    }
}


/**
 * Default Widget class.
 * Exposes custom event bindings, inherits log/Analytics/global modules/etc.
 * @extends Base.SiteObject
 * @class Widget
 */
export class Widget extends SiteObject {
	EVENT_BINDINGS: Object;

	constructor(_el:JQuery){
		super(_el);

		this.EVENT_BINDINGS = {};

        if(!this.$root.data('app-widget')){
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
	bind(evt:string, fnc:any):void {
        if(this.EVENT_BINDINGS.hasOwnProperty(evt)){
            this.EVENT_BINDINGS[evt].push(fnc);
        } else {
            this.EVENT_BINDINGS[evt] = [fnc];
        }
    }

    /**
     * Alias for Widget.bind
     * @param {string} evt Custom event name (e.g. 'my-event')
	 * @param {any}    fnc Event handler
     */
    on(evt:string, fnc:any):void {
        return this.bind(evt, fnc);
    }

    /**
     * Trigger for custom events.
     * Given a custom event string, checks if object has made that binding, and executes if so
     * @param {string} type Custom event name (e.g. 'my-event')
     * @param {Object} data Object of any relevant data
     */
    onEvents(type:string, data?:Object):void {
        if(this.EVENT_BINDINGS.hasOwnProperty(type)){
            for(var i = 0; i < this.EVENT_BINDINGS[type].length; i++){
                (this.EVENT_BINDINGS[type][i])(data);
            }
        }
    }

    /**
     * Alias for Widget.onEvents
     * @param {string} type Custom event name (e.g. 'my-event')
     * @param {Object} data Object of any relevant data
     */
    emit(type:string, data?:Object):void {
    	return this.onEvents(type, data);
    }

    /**
     * Removes any bindings made to $root and children,
     * also calls SiteObject.dispose (removes window events)
     */
	dispose():void {
		super.dispose();
		if(this && this.$root){
			this.$root.find('*').unbind();
        	this.$root.unbind();
		}
	}
}

/**
 * DimOverlay class to handle the overlay fade and custom events (onclick etc)
 * Established in Base.SiteObject
 */
export class DimOverlay extends Loggable {
    public $el:JQuery;
    private $root:JQuery;
    private $body:JQuery;

    constructor(){
        super();
        this.$body = $(document.body);
        this.$root = this.$el = this.buildDim();
    }

    private buildDim():JQuery {
        var $dim:JQuery = $('#dim');
        if(!$dim || !$dim.length){
            $dim = $('<div id="dim"></div>').prependTo(document.body);
        }
        return $dim;
    }

    public show(keepDim:boolean = false):void {
        if(keepDim && this.$body.hasClass('has-dim')){
            this.$body.addClass('keep-dim');
        }
        this.$root.addClass('show');
        this.$body.addClass('has-dim');
    }

    public hide():void {
        if(this.$body.hasClass('keep-dim')){
            this.$body.removeClass('keep-dim');
            return;
        }
        this.$root.removeClass('show');
        this.$body.removeClass('has-dim');
    }
}


