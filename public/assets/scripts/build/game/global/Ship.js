var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base'], function(require, exports, Base) {
    

    /**
    * Ship class. Preloads Ships and offers functions to play/stop/etc
    * @class Ship
    * @exends Base.Loggable
    */
    var Ship = (function (_super) {
        __extends(Ship, _super);
        function Ship(Game) {
            _super.call(this);
            this.Game = Game;
            this.$body = $(document.body);
            this.log('Ship : Constructor');
            this.init();
        }
        Ship.prototype.init = function () {
            var self = this;
            self.createShip();
            self.bindKeys();
        };

        Ship.prototype.createShip = function () {
            var self = this, size = 500;
            self.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size, size, size), Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0xffffff, fog: false }), 1, 1), 10);

            var light = new THREE.PointLight(0xFF0000);
            self.mesh.add(light);
            light.intensity = 1;
            light.position.set(0, 0, 0);

            self.mesh.position.set(-500, 0, 0);
            self.mesh.__dirtyPosition = true;
            self.mesh.castShadow = self.mesh.receiveShadow = false;
        };

        Ship.prototype.bindKeys = function () {
            var _this = this;
            this.$body.on('keydown', function (e) {
                switch (e.which) {
                    case 87:
                        _this.push('up');
                        break;
                    case 83:
                        _this.push('down');
                        break;
                    case 65:
                        _this.push('left');
                        break;
                    case 68:
                        _this.push('right');
                        break;
                }
            });
        };

        Ship.prototype.getMesh = function () {
            return this.mesh;
        };

        Ship.prototype.push = function (dir) {
            var self = this, strength = 10000;

            switch (dir) {
                case 'up':
                    self.mesh.applyImpulse(new THREE.Vector3(-strength, 0, 0), new THREE.Vector3(0, 0, 0));
                    break;
                case 'down':
                    self.mesh.applyImpulse(new THREE.Vector3(strength, 0, 0), new THREE.Vector3(0, 0, 0));
                    break;
                case 'right':
                    self.mesh.applyImpulse(new THREE.Vector3(0, 0, -strength), new THREE.Vector3(0, 0, 0));
                    break;
                case 'left':
                    self.mesh.applyImpulse(new THREE.Vector3(0, 0, strength), new THREE.Vector3(0, 0, 0));
                    break;
            }
            // self.mesh.setLinearFactor(new THREE.Vector3(1,1,1));
            // self.mesh.applyImpulse(new THREE.Vector3(500, 0, 0), new THREE.Vector3(0,0,0));
        };
        return Ship;
    })(Base.Loggable);
    return Ship;
});
