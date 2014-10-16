/// <reference path="reference/jquery.d.ts" />

import Base = require('core/base');
import reqFactory = require('core/factory');
import Game = require('game');

/**
 * Main class (entry point for application).
 * Pretty much just creates and inits a new Main class.
 * @class Main
 */
class Main extends Base.SiteObject {
	Game: Game;
	Factory: any;
    player: any;
    loadTimer:any;
    hasLoaded:boolean = false;

    constructor() {
        super($(document.body));
        this.log('Main : Constructor');

        this.init();
    }

    /**
     * Main initialization.
     * Inits Analytics, Factory, WindowController.
     * Removes .loading from body on dom.ready
     * @access public
     */
    public init():void {
        var self:Main = this;
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

        $(window).on('load', <any>( ()=>this.onLoadEvent() ));

        //fallback for load event
        //(works if window is blurred when loaded)
        self.loadTimer = setInterval(()=>{
            if (document.readyState === 'complete' && !self.hasLoaded) {
                self.onLoadEvent();
                clearInterval(self.loadTimer);
            }
        }, 50);
    }


    private onLoadEvent():void {
        var self:Main = this;
        self.hasLoaded = true;
	    self.Game = new Game(self.hasTouch);
	    self.Game.init();
    }

    /**
     * Determines if User Agent is IE/IE Mobile and Mainends class to html element as necessary.
     * Also detects touch-based devices (html.is-touch) and modifies console.time/End if not in debug mode.
     * @access private
     */
    private checkUserAgent():void {
        var $html:JQuery = this.$html,
            $body:JQuery = this.$body,
            UA:string = $html.attr('data-ua') || '';

        // windows or mac?
        if(navigator && navigator.platform){
            if(navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)){
                $html.addClass('mac');
            }else if(navigator.platform.match(/Win/i)){
                $html.addClass('windows');
            }
        }

        // Various ways to determine if it's IE (since IE10 or 11 is a jerk about its UA)
        if((/MSIE/i).test(UA) || (/Trident\/[0-9\.]+/i).test(UA) || window.hasOwnProperty('MSStream')){
            $html.addClass('ie');
            if((/IEMobile/i).test(UA)){
                $html.addClass('ie-mobile');
            }
        }
        var isDebug:boolean = ($body.attr('data-debug') && $body.attr('data-debug') === 'true' ? true : false);
        if(!isDebug){
            console.time = console.timeEnd = function(){ return; };
        }

        if('ontouchstart' in window){ $html.addClass('is-touch'); }
    }
}

new Main();
