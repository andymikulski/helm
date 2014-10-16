/// reference path="reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');

// export = Audio;

module Audio {
    /**
     * Sound class. Preloads sounds and offers functions to play/stop/etc
     * @class Sound
     * @exends Base.Loggable
     */
    export class Sound extends Base.Loggable {
        private $body:JQuery = $(document.body);
        private $root:JQuery;

        private IS_LOADED:boolean = false;

        constructor(private url:string, private loop:boolean = false) {
            super();
            this.log('Sound : Constructor');
            this.init();
        }

        private init():void {
            this.log('Sound : Init');
            this.buildElement();
        }

        private buildElement():void {
            var self:Sound = this;

            self.$root = $('<audio src="' + self.url + '" preload="auto" controls' + (this.loop ? ' loop' : '') + '></audio>');
            self.$root.on('loaded onloaded', (e)=>{ console.log(['loaded hi']); });
            self.$body.append(self.$root);
        }
    }

    /**
     * Music class. Preloads Musics and offers functions to play/stop/etc
     * @class Music
     * @exends Base.Loggable
     */
    export class Music extends Base.Loggable {
        private sound:Sound;

        constructor(private url:string) {
            super();
            this.log('Music : Constructor');
            this.init();
        }

        private init():void {
            this.log('Music : Init');
            this.sound = new Audio.Sound(this.url, true);
        }
    }

}
