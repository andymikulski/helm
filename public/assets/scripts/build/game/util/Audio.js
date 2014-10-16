var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base', 'core/logger'], function(require, exports, Base, Logger) {
    

    var Audio;
    (function (Audio) {
        Audio.IS_MUTED = false;
        function isMuted() {
            return Audio.IS_MUTED;
        }
        Audio.isMuted = isMuted;

        function mute() {
            Logger.log('Audio : Mute (global)');
            Audio.IS_MUTED = true;
            $('audio').each(function (i, v) {
                $(v).attr('muted', 'true');
                v.volume = 0;
            });
        }
        Audio.mute = mute;
        function unmute() {
            Logger.log('Audio : Unmute (global)');
            Audio.IS_MUTED = false;
            $('audio').each(function (i, v) {
                $(v).attr('muted', null);
                v.volume = 1;
            });
        }
        Audio.unmute = unmute;

        /**
        * Sound class. Preloads sounds and offers functions to play/stop/etc
        * @class Sound
        * @exends Base.Loggable
        */
        var Sound = (function (_super) {
            __extends(Sound, _super);
            function Sound(url, loop, autoplay) {
                if (typeof loop === "undefined") { loop = false; }
                if (typeof autoplay === "undefined") { autoplay = false; }
                _super.call(this);
                this.url = url;
                this.loop = loop;
                this.autoplay = autoplay;
                this.$body = $(document.body);
                this.IS_LOADED = false;
                this.LOAD_EVENTS = [];
                this.log('Sound : Constructor');
                this.init();
            }
            Sound.prototype.init = function () {
                this.log('Sound : Init');
                this.buildElement();
            };

            Sound.prototype.buildElement = function () {
                var self = this;

                self.$root = $('<audio src="' + self.url + '" preload="auto" controls' + (this.loop ? ' loop' : '') + (Audio.IS_MUTED ? ' muted' : '') + '></audio>');
                self.root = self.$root[0];

                if (self.autoplay) {
                    self.play();
                }

                self.$root.on('loadeddata', function (e) {
                    return self.onLoadEvent(e);
                });
                self.$body.append(self.$root);
            };

            Sound.prototype.onLoadEvent = function (e) {
                var self = this, currentEvent;
                self.IS_LOADED = true;

                for (var i = 0; i < self.LOAD_EVENTS.length; i++) {
                    currentEvent = self.LOAD_EVENTS[i];
                    if (currentEvent instanceof Array) {
                        currentEvent[0].apply(currentEvent[1]);
                    } else {
                        currentEvent();
                    }
                }
            };

            Sound.prototype.onLoad = function (fnc, context) {
                var self = this;

                if (self.IS_LOADED === true) {
                    (context ? fnc.apply(context) : fnc());
                } else {
                    self.LOAD_EVENTS.push(context ? [fnc, context] : fnc);
                }
            };

            Sound.prototype.play = function () {
                var self = this;
                self.log('Audio.Music : play');
                self.onLoad(function () {
                    // self.root.play&&self.root.play();
                });
            };

            Sound.prototype.pause = function () {
                var self = this;
                self.log('Audio.Music : pause');
                self.root.pause && self.root.pause();
            };

            Sound.prototype.stop = function () {
                var self = this;
                self.log('Audio.Music : stop');
                self.root.stop && self.root.stop();
            };
            return Sound;
        })(Base.Loggable);
        Audio.Sound = Sound;

        /**
        * Music class. Preloads Musics and offers functions to play/stop/etc
        * @class Music
        * @exends Base.Loggable
        */
        var Music = (function (_super) {
            __extends(Music, _super);
            function Music(url, autoplay) {
                if (typeof autoplay === "undefined") { autoplay = false; }
                _super.call(this, url, true, autoplay);
                this.log('Music : Constructor');
            }
            return Music;
        })(Audio.Sound);
        Audio.Music = Music;
    })(Audio || (Audio = {}));
    return Audio;
});
