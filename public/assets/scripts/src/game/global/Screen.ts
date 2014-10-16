// reference path="reference/three.d.ts" />
import Base = require('core/base');

export = Screen;
/**
 * Screen class. Builds global controllers etc and starts the Screen.
 * @class Screen
 * @exends Base.SiteObject
 */
class Screen extends Base.SiteObject {
	private $container:JQuery;

    constructor(_el:JQuery) {
        super(_el);
        this.log('Screen : Constructor');
        this.createScreenElements();
    }

    public init() {
        this.log('Screen : Init');

        this.createScreenElements();
    }

    private createScreenElements(){
    	var self:Screen = this,
    		$canvas:JQuery = $('<canvas></canvas>');

    	self.$root.append($canvas);
    	self.$root = $canvas;
    }

    public getContext():CanvasRenderingContext2D {
    	var root:any = this.$root[0];
    	return root.getContext('2d');
    }
}
