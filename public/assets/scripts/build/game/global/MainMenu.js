var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'game/util/Menu'], function(require, exports, Menu) {
    

    /**
    * MainMenu class. Preloads MainMenus and offers functions to play/stop/etc
    * @class MainMenu
    * @exends Base.Loggable
    */
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu(_game) {
            _super.call(this, _game, 'assets/sounds/menu.ogg', 'MainMenu');
            this.log('MainMenu : Constructor');

            this.createItems();
            this.updateList();
        }
        MainMenu.prototype.createItems = function () {
            var _this = this;
            this.menuItems = {
                'New Game': function () {
                    return _this.newGame();
                }
            };
        };

        MainMenu.prototype.newGame = function () {
            this.hide();
            this.Game.startGame.call(this.Game);
        };

        MainMenu.prototype.updateList = function () {
            var $list = this.$root.find('.menu-list');
            for (var prop in this.menuItems) {
                if (this.menuItems.hasOwnProperty(prop)) {
                    var $item = $('<li>' + prop + '</li>');
                    $item.on('click', this.menuItems[prop]);
                    $list.append($item);
                }
            }
        };
        return MainMenu;
    })(Menu);
    return MainMenu;
});
