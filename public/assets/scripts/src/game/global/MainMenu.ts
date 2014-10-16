/// reference path="reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Audio = require('game/util/Audio');
import Menu = require('game/util/Menu');

export = MainMenu;
/**
 * MainMenu class. Preloads MainMenus and offers functions to play/stop/etc
 * @class MainMenu
 * @exends Base.Loggable
 */
class MainMenu extends Menu {
    private menuItems:any;

    constructor(_game:Game) {
        super(_game, 'assets/sounds/menu.ogg', 'MainMenu');
        this.log('MainMenu : Constructor');

        this.createItems();
        this.updateList();
    }

    private createItems():void {
        this.menuItems = {
            'New Game': ()=>this.newGame()
        };
    }

    private newGame():void {
        this.hide();
        this.Game.startGame.call(this.Game);
    }

    private updateList():void {
        var $list:JQuery = this.$root.find('.menu-list');
        for(var prop in this.menuItems){
            if(this.menuItems.hasOwnProperty(prop)){
                var $item:JQuery = $('<li>' + prop + '</li>');
                $item.on('click', this.menuItems[prop]);
                $list.append($item);
            }
        }
    }
}
