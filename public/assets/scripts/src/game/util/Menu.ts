/// reference path="reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Audio = require('game/util/Audio');

export = Menu;
/**
 * Menu class. Preloads Menus and offers functions to play/stop/etc
 * @class Menu
 * @exends Base.Loggable
 */
class Menu extends Base.Loggable {
    private $body:JQuery = $(document.body);
    public $root:JQuery;
    private bgMusic:Audio.Music;
    private IS_SHOWING:boolean = false;
    private ENABLED:boolean = false;

    constructor(public Game:Game, private musicURL:string = 'assets/sounds/menu.ogg', private TEMPLATE:string = 'Menu') {
        super();
        this.log('Menu : Constructor');
        this.init();
    }

    private init():void {
        this.log('Menu : Init');
        this.buildElement();

        this.loadMusic();
        this.bindKeys();
    }

    private buildElement():void {
        var self:Menu = this;

        self.$root = $(self.$body.find('[data-template="' + self.TEMPLATE + '"]').html());
        self.Game.$ui.prepend(self.$root);
    }

    private loadMusic():void {
        var self:Menu = this;
        self.bgMusic = new Audio.Music(self.musicURL);
    }

    private bindKeys():void {
        this.$body.on('keyup', (e:any)=>{
            var keyCode:number = e.which;
            switch(e.which){
                case 27:
                    if(this.ENABLED){
                        this.toggleVisibility();
                    }
                    break;
                // default:
                    // this.log('e which', e, e.which);
                    // break;
            }
        });
    }

    public enable():Menu {
        this.ENABLED = true;
        return this;
    }

    public disable():Menu {
        this.ENABLED = false;
        return this;
    }

    private toggleVisibility():Menu {
        if(this.IS_SHOWING){
            return this.hide();
        }else{
            return this.show();
        }
    }

    public show():Menu {
        var self:Menu = this;
        self.IS_SHOWING = true;
        self.$root.addClass('is-visible');
        self.$body.addClass('has-menu has-ui');
        self.bgMusic.play();
        return self;
    }

    public hide():Menu {
        var self:Menu = this;
        self.IS_SHOWING = false;
        self.$root.removeClass('is-visible');
        self.$body.removeClass('has-menu has-ui');
        self.bgMusic.pause();
        return self;
    }

}
