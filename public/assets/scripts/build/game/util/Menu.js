var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base', 'game/util/Audio'], function(require, exports, Base, Audio) {
    

    /**
    * Menu class. Preloads Menus and offers functions to play/stop/etc
    * @class Menu
    * @exends Base.Loggable
    */
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(Game, musicURL, TEMPLATE) {
            if (typeof musicURL === "undefined") { musicURL = 'assets/sounds/menu.ogg'; }
            if (typeof TEMPLATE === "undefined") { TEMPLATE = 'Menu'; }
            _super.call(this);
            this.Game = Game;
            this.musicURL = musicURL;
            this.TEMPLATE = TEMPLATE;
            this.$body = $(document.body);
            this.IS_SHOWING = false;
            this.ENABLED = false;
            this.log('Menu : Constructor');
            this.init();
        }
        Menu.prototype.init = function () {
            this.log('Menu : Init');
            this.buildElement();

            this.loadMusic();
            this.bindKeys();
        };

        Menu.prototype.buildElement = function () {
            var self = this;

            self.$root = $(self.$body.find('[data-template="' + self.TEMPLATE + '"]').html());
            self.Game.$ui.prepend(self.$root);
        };

        Menu.prototype.loadMusic = function () {
            var self = this;
            self.bgMusic = new Audio.Music(self.musicURL);
        };

        Menu.prototype.bindKeys = function () {
            var _this = this;
            this.$body.on('keyup', function (e) {
                var keyCode = e.which;
                switch (e.which) {
                    case 27:
                        if (_this.ENABLED) {
                            _this.toggleVisibility();
                        }
                        break;
                }
            });
        };

        Menu.prototype.enable = function () {
            this.ENABLED = true;
            return this;
        };

        Menu.prototype.disable = function () {
            this.ENABLED = false;
            return this;
        };

        Menu.prototype.toggleVisibility = function () {
            if (this.IS_SHOWING) {
                return this.hide();
            } else {
                return this.show();
            }
        };

        Menu.prototype.show = function () {
            var self = this;
            self.IS_SHOWING = true;
            self.$root.addClass('is-visible');
            self.$body.addClass('has-menu has-ui');
            self.bgMusic.play();
            return self;
        };

        Menu.prototype.hide = function () {
            var self = this;
            self.IS_SHOWING = false;
            self.$root.removeClass('is-visible');
            self.$body.removeClass('has-menu has-ui');
            self.bgMusic.pause();
            return self;
        };
        return Menu;
    })(Base.Loggable);
    return Menu;
});
