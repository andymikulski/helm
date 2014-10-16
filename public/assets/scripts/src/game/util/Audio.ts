/// reference path="reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Logger = require('core/logger');

export = Audio;

module Audio {
    export var IS_MUTED:boolean = false;
    export function isMuted():boolean {
        return Audio.IS_MUTED;
    }

    export function mute():void {
        Logger.log('Audio : Mute (global)');
        Audio.IS_MUTED = true;
        $('audio').each((i:number, v:any)=>{
            $(v).attr('muted', 'true');
            v.volume = 0;
        });
    }
    export function unmute():void {
        Logger.log('Audio : Unmute (global)');
        Audio.IS_MUTED = false;
         $('audio').each((i:number, v:any)=>{
            $(v).attr('muted', null);
            v.volume = 1;
        });
    }

    /**
     * Sound class. Preloads sounds and offers functions to play/stop/etc
     * @class Sound
     * @exends Base.Loggable
     */
    export class Sound extends Base.Loggable {
        private $body:JQuery = $(document.body);
        private $root:JQuery;
        private root:any;

        private IS_LOADED:boolean = false;
        private LOAD_EVENTS:Array<any> = [];

        constructor(public url:String, public loop:boolean = false, public autoplay:boolean = false) {
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

            self.$root = $('<audio src="' + self.url + '" preload="auto" controls' + (this.loop ? ' loop' : '')  + (Audio.IS_MUTED ? ' muted' : '') + '></audio>');
            self.root = self.$root[0];

            if(self.autoplay){
                self.play();
            }

            self.$root.on('loadeddata', (e)=>self.onLoadEvent(e) );
            self.$body.append(self.$root);
        }

        private onLoadEvent(e:Event):void {
            var self:Sound = this,
                currentEvent:any;
            self.IS_LOADED = true;

            for(var i:number = 0; i < self.LOAD_EVENTS.length; i++){
                currentEvent = self.LOAD_EVENTS[i];
                if(currentEvent instanceof Array){
                    currentEvent[0].apply(currentEvent[1]);
                }else{
                    currentEvent();
                }
            }
        }

        public onLoad(fnc:any, context?:any):void {
            var self:Sound = this;

            if(self.IS_LOADED === true){
                (context ? fnc.apply(context) : fnc());
            }else{
                self.LOAD_EVENTS.push(
                    context ? [fnc, context] : fnc
                );
            }
        }

        public play():void {
            var self:Sound = this;
            self.log('Audio.Music : play');
            self.onLoad(()=>{
                // self.root.play&&self.root.play();
            });
        }

        public pause():void {
            var self:Sound = this;
            self.log('Audio.Music : pause');
            self.root.pause&&self.root.pause();
        }

        public stop():void {
            var self:Sound = this;
            self.log('Audio.Music : stop');
            self.root.stop&&self.root.stop();
        }
    }

    /**
     * Music class. Preloads Musics and offers functions to play/stop/etc
     * @class Music
     * @exends Base.Loggable
     */
    export class Music extends Audio.Sound {
        constructor(url:string, autoplay:boolean = false) {
            super(url, true, autoplay);
            this.log('Music : Constructor');
        }
    }

}
