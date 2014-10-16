var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base', 'game/util/Audio', 'game/util/Grid'], function(require, exports, Base, Audio, Grid) {
    

    /**
    * BGController class. Used to manipulate the starfield/skybox in the background
    * @class BGController
    * @exends Base.Loggable
    */
    var BGController = (function (_super) {
        __extends(BGController, _super);
        function BGController(Game) {
            _super.call(this);
            this.Game = Game;
            this.log('BGController : Constructor');
            this.init();
        }
        BGController.prototype.init = function () {
            this.log('BGController : Init');
            this.drawStars();
            this.createLight();
            this.createGameGrid();
            this.makeSweetBeautifulMusic();
        };

        BGController.prototype.makeSweetBeautifulMusic = function () {
            this.bgMusic = new Audio.Music('assets/sounds/lose.ogg', true);
        };

        BGController.prototype.drawStars = function () {
            this.log('BGController : drawStars');
            this.starMesh = this.createStars();
            this.Game.addToScene(this.starMesh);

            this.Game.addUpdate(this.updateStars, this);
        };

        BGController.prototype.updateStars = function (delta, elapsed) {
            this.starMesh.rotation.x += delta / 200;
        };

        BGController.prototype.createLight = function () {
            this.log('BGController : createLight');
            this.Game.addToScene(new THREE.AmbientLight(0xfefefe));
        };

        BGController.prototype.createStars = function () {
            this.log('BGController : createStars');
            var geometry = new THREE.SphereGeometry(10000, 60, 40);
            var uniforms = {
                texture: { type: 't', value: THREE.ImageUtils.loadTexture('assets/images/galaxy_starfield.png') }
            };

            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: document.getElementById('sky-vertex').textContent,
                fragmentShader: document.getElementById('sky-fragment').textContent
            });

            var skyBox = new THREE.Mesh(geometry, material);
            skyBox.scale.set(-1, 1, 1);
            skyBox.rotation.order = 'XZY';
            skyBox.renderDepth = 1000.0;
            skyBox.rotation.x += 90;
            return skyBox;
        };

        BGController.prototype.createGameGrid = function (dir) {
            this.log('BGController : createGameGrid');
            var size = 1000, step = 50, grid1 = new Grid(this.Game, size, step);

            // grid1:any = new THREE.grid1( size, step );
            // grid1.setColors(0xff0000, 0xff0000);
            // we'll throw the grid into a container so it doesn't get read by intersects
            var gridContainer = new THREE.Object3D();
            gridContainer.add(grid1.mesh);
            this.Game.addToScene(gridContainer);
        };
        return BGController;
    })(Base.Loggable);
    return BGController;
});
